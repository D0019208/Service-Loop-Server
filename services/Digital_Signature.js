"use strict";
const fs = require('fs');
var exec = require('child_process').exec, child;

class Digitally_Sign {
    constructor() {
    }

    /**
     * This function creates a PDF from the content given and then
     * appending the each parties signature and creating an audit trail
     * afterwards.
     * 
     * @param {This is the name of the PDF E.G. 'contract.pdf'} pdf_name 
     * @param {This is the text content of the PDF} pdf_content 
     * @param {This is the signature of party1} party1_signature
     * @param {This is the signature of party2} party2_signature
     */
    create_pdf(pdf_name, pdf_content, party1_signature, party2_signature) {
        return new Promise((resolve, reject) => {
            const PDFDocument = require('pdfkit');
            // Create a document
            const doc = new PDFDocument();

            // // Embed a font, set the font size, and render some text
            // doc.font('fonts/PalatinoBold.ttf')
            //   .fontSize(25)
            //   .text('Some text with an embedded font!', 100, 100);

            // // Add an image, constrain it to a given size, and center it vertically and horizontally
            // doc.image('path/to/image.png', {
            //   fit: [250, 300],
            //   align: 'center',
            //   valign: 'center'
            // });

            // Add another page
            doc.fontSize(13).text(pdf_content, 100, 100);

            doc.end();

            // Pipe its output somewhere, like to a file or HTTP response
            // See below for browser usage
            //Maybe put on top for better PERFORMANCE
            let writeStream = doc.pipe(fs.createWriteStream('./resources/pdfs/' + pdf_name + '.pdf')); 

            writeStream.on('error', function (err) {
                if (err.code === 'ENOENT') {
                    reject("File creation failed!");
                } else {
                    reject("An unexpected error has occured when creating files!"); 
                } 
            });

            writeStream.on('finish', function () {
                resolve("resources/pdfs/" + pdf_name);
            }); 
        });

    }

    /**
     * This is the function that will be called to create and sign a PDF.
     * It first goes to the create_pdf() function where it creates a PDF
     * based on the contents provided and then digitally signs that PDF.
     * 
     * @param {This is the name of the PDF E.G. 'contract.pdf'} pdf_name 
     * @param {This is the text content of the PDF} pdf_content 
     * @param {This is the signature of party1} party1_signature
     * @param {This is the signature of party2} party2_signature
     */
    async create_digitally_signed_pdf(pdf_name, pdf_content, party1_signature, party2_signature) {
        let pdf_path;
        //Create the PDF and get its path
        try {
            pdf_path = await this.create_pdf(pdf_name, pdf_content, party1_signature, party2_signature);
        } catch(err) {
            return err;
        } 

        return new Promise((resolve, reject) => {
            //Check to see that PDF has been created 
                //Digitally Sign for first user (Must add image of signature later perhaps) e.g. resources/pdfs/testPDF.pdf
                exec('java -jar "resources/java/JSignPdf.jar" "' + pdf_path + '.pdf" -v --visible-signature -d resources/pdfs -a --bg-path "resources/images/adobe_watersign.png" -page 1000 -kst PKCS12 -ksf "resources/keystore_files/test.p12" -ksp test 2>&1',
                    (error, stdout, stderr) => {
                        //On error, delete the PDFs, on success, sign second user
                        if (error !== null) {
                            console.groupCollapsed("Error handling 1st signing");
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            console.log('exec error: ' + error);
                            console.groupEnd();

                            //Delete PDF
                            fs.unlinkSync(pdf_path + ".pdf");

                            //Return error
                            reject("Failed to create PDF, please try again.")
                        } else {
                            //Delete PDF
                            fs.unlinkSync(pdf_path + ".pdf");

                            //Digitally Sign for second user (Must add image of signature later perhaps) e.g. resources/pdfs/testPDF_signed.pdf
                            exec('java -jar "resources/java/JSignPdf.jar" "' + pdf_path + '_signed.pdf" -v --visible-signature -d resources/pdfs -llx 612 -lly 0 -urx 500 -ury 100 -a --append --bg-path "resources/images/adobe_watersign.png" -page 1000 -kst PKCS12 -ksf "resources/keystore_files/test.p12" -ksp test 2>&1',
                                (error, stdout, stderr) => {
                                    //On error, delete the PDFs, on success, delete the old PDF
                                    if (error !== null) {
                                        console.groupCollapsed("Error handling 2nd signing");
                                        console.log('stdout: ' + stdout);
                                        console.log('stderr: ' + stderr);
                                        console.log('exec error: ' + error);
                                        console.groupEnd();

                                        //Delete PDF
                                        fs.unlinkSync(pdf_path + "_signed.pdf");
                                        fs.unlinkSync(pdf_path + "_signed_signed.pdf");

                                        //Return error
                                        reject("Failed to create PDF, please try again.")
                                    } else {
                                        fs.unlinkSync(pdf_path + "_signed.pdf");

                                        //Rename the file from John_Doe_and_Jane_Doe_contract_signed_signed.pdf to just
                                        //John_Doe_and_Jane_Doe_contract_signed.pdf
                                        fs.rename(pdf_path + "_signed_signed.pdf", pdf_path + "_signed.pdf", (err) => {
                                            if (err) {
                                                console.log('ERROR: ' + err);
                                            } else {
                                                resolve(pdf_path + "_signed.pdf");
                                            }
                                        });
                                    }
                                });
                        }
                    }); 
        });
    }

    verify_all_digital_signatures(user_name) {
        let all_user_pdfs = ["resources/pdfs/testPDF_signed.pdf", "resources/pdfs/John_Doe_and_Jane_Doe_contract_signed.pdf"];
        let compromised_pdfs = [];
        let error_message = '';

        //Get this from DB, same thing will be done for all other people that are in a contract with this user
        let user_identity = { name: "John Doe", identity_info: { keystore_file_location: "resources/keystore_files/johnnie.jks", keystore_password: "johnniestoresecret" } };

        //2 parts to this function, test all users Digital signatures, then test all other parties which are
        //involved with the user digital signatures.

        //console.log('java -jar "resources/java/Verifier.jar" ' + pdfs_to_check + '-kf "' + user_identity.identity_info.keystore_file_location + '" -kp ' + user_identity.identity_info.keystore_password + ' -kt JKS 2>&1');

        //Loop through each contract to see if it has been tampered with.
        //NOTE - We could have checked all PDFS in one query but we wouldn't
        //       know which particular PDF failed as I can't get the stdout as
        //       an array to then check. This way we will know which one failed.
        //
        //CONSIDER REFACTORING USING FOREACH https://stackoverflow.com/questions/13343340/calling-an-asynchronous-function-within-a-for-loop-in-javascript


        return new Promise((resolve, reject) => {
            for (let i = 0; i < all_user_pdfs.length; i++) {
                child = exec('java -jar "resources/java/Verifier.jar" "' + all_user_pdfs[i] + '" -kf "' + user_identity.identity_info.keystore_file_location + '" -kp ' + user_identity.identity_info.keystore_password + ' -kt JKS 2>&1',
                    (error, stdout, stderr) => {
                        if (error !== null) {
                            if (error.code !== 60) {
                                switch (error.code) {
                                    case 10:
                                        //SIG_STAT_CODE_WARNING_NO_SIGNATURE 
                                        error_message = "Warning! The PDF has no signatures. Warning code 10.";
                                        break;
                                    case 15:
                                        //SIG_STAT_CODE_WARNING_ANY_WARNING
                                        error_message = "Warning! Something went wrong. Warning code 15.";
                                        break;
                                    case 20:
                                        //SIG_STAT_CODE_WARNING_NO_REVOCATION_INFO 
                                        error_message = "Warning! There is no revocation info. Warning code 20.";
                                        break;
                                    case 30:
                                        //SIG_STAT_CODE_WARNING_TIMESTAMP_INVALID 
                                        error_message = "Warning! The timestamp is invalid. Warning code 30.";
                                        break;
                                    case 40:
                                        //SIG_STAT_CODE_WARNING_NO_TIMESTAMP_TOKEN 
                                        error_message = "Warning! There is no timestamp token. Warning code 40.";
                                        break;
                                    case 50:
                                        //SIG_STAT_CODE_WARNING_SIGNATURE_OCSP_INVALID
                                        error_message = "Warning! The Signature OCSP is invalid. Warning code 50.";
                                        break;
                                    case 60:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_CANT_BE_VERIFIED
                                        error_message = "Warning! Your certificate can't be verified. Warning code 60.";
                                        break;
                                    case 61:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_EXPIRED
                                        error_message = "Warning! Your certificate has expired. Warning code 61.";
                                        break;
                                    case 62:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_NOT_YET_VALID
                                        error_message = "Warning! Your certificate is not yet valid. Warning code 62.";
                                        break;
                                    case 63:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_REVOKED
                                        error_message = "Warning! Your certificate has been revoked. Warning code 63.";
                                        break;
                                    case 64:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_UNSUPPORTED_CRITICAL_EXTENSION
                                        error_message = "Warning! Your certificate is not supported. Warning code 64.";
                                        break;
                                    case 65:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_INVALID_STATE
                                        error_message = "Warning! Your certificate has an invalid state. Warning code 65.";
                                        break;
                                    case 66:
                                        //SIG_STAT_CODE_WARNING_CERTIFICATE_PROBLEM
                                        error_message = "Warning! There is a porblem with your certificate. Warning code 66.";
                                        break;
                                    case 70:
                                        //SIG_STAT_CODE_WARNING_UNSIGNED_CONTENT
                                        error_message = "Warning! Unsigned content was detected. Warning code 70.";
                                        break;
                                    case 101:
                                        //SIG_STAT_CODE_ERROR_FILE_NOT_READABLE
                                        error_message = "Error! The PDF is not readable. Error code 101.";
                                        break;
                                    case 102:
                                        //SIG_STAT_CODE_ERROR_UNEXPECTED_PROBLEM
                                        error_message = "Error! An unexpected error has occured, please try again. Error code 102.";
                                        break;
                                    case 105:
                                        //SIG_STAT_CODE_ERROR_ANY_ERROR
                                        error_message = "Error! An error has occured, please try again. Error code 105.";
                                        break;
                                    case 110:
                                        //SIG_STAT_CODE_ERROR_CERTIFICATION_BROKEN 
                                        error_message = "Error! Your certificate is broken. Error code 110.";
                                        break;
                                    case 120:
                                        //SIG_STAT_CODE_ERROR_REVISION_MODIFIED
                                        error_message = "Error! There has been a modification. Error code 120.";
                                }

                                //console.log('stdout: ' + stdout);
                                //console.log('stderr: ' + stderr);
                                //console.log('exec error: ' + error);
                                compromised_pdfs.push(all_user_pdfs[i]);
                            }
                        }

                        if (i == all_user_pdfs.length - 1) {

                            if (compromised_pdfs.length === 0) {
                                resolve('Success');
                            } else {
                                //DELETE COMPROMISED PDFS
                                console.log(error_message);
                                //console.log(compromised_pdfs);
                                reject(error_message);
                            }

                        }
                    });
            }
        });
    }
}

module.exports = Digitally_Sign;