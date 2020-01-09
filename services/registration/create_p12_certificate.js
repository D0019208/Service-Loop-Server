"use strict";

/**
 * This is the function that actually contains the code to create the Digital Certificate.
 * 
 * @param {user_id} user_id - This is the ID of the user in the database that we shall use to identify the Digital Certificate e.g. "5e0e14c481073e233955a5aa"
 * @param {user_certificate_password} users_password - This is the password that we shall use to protect the users Digital Certificate,
 * e.g. "dsfdsKfsfdL@2!"
 * @param {user_email} users_email - This is the users email, e.g. "JohnWick@gmail.com"
 * @param {users_full_name} users_full_name - This is the users fullname e.g. "John Wick" 
 * 
 * @returns {Promise}
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