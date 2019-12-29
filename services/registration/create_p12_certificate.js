"use strict";

/**
 * This is the function that will be called to create and generate the Digital Certificates
 * for the user. The Digital Certificate will contain information about the user explained
 * in the below variables. The function takes 8 parameters and creates the certificate 
 * asynchronously. If there is an error, our try/catch blocks will catch it and safely return
 * an error to the user.
 * 
 * @param {This is the full name of the user} users_name 
 * @param {This is the password of the user which we will/have hashed} users_password 
 * @param {This is the email of the user} users_email 
 */
let create_user_certificate = async function create_user_certificate(user_id, user_certificate_password, user_email, users_full_name) {
    let error;

    try {
        /*
          Variables for when the certificate creation is done,
          If the success variable stays at false, then we have an error
          If not, then the file was created successfully and we return the
          file path.
        */
        let success = false;
        

        //Options for creating the certificate
        let p12 = require('node-openssl-p12').createClientSSL;
        let p12options = {
            bitSize: 2048,
            clientFileName: 'client_' + user_id,
            C: "IE",
            ST: "Louth",
            L: "Dundalk",
            O: 'Service Loop',
            OU: 'www.serviceloop.com',
            CN: users_full_name,
            emailAddress: user_email,
            clientPass: user_certificate_password,
            caFileName: 'ca',
            serial: "01",
            days: 365
        };
        
        //When done creating file, set success to true to then return the file path
        await p12(p12options).done((options, sha1fingerprint) => {
            success = true;
        }).fail((err) => {
            success = false; 
            error = err.message;
        }); 

        if (success) {
            return 'ssl/client_' + user_id + '.p12';
        } else {
            //return 'Digital Certificate creation failed! ' + error.message + '!'; 
            return 'Digital Certificate creation failed.';
        }
    } catch (err) {
        //return 'Digital Certificate creation failed! ' + err.message + '!';
        return err.message;
    }
}

exports.create_user_certificate = create_user_certificate;