"use strict";

/**
 * This is the function that will be called to create a new user and generate a Digital Certificates
 * for the user. It takes 5 parameters and firstly creates the certificate asynchronously 
 * while the rest of the function logs the information to the database.
 * 
 * @param {This is the full name of the user} users_name 
 * @param {This is the password of the user which we have hashed} users_password 
 * @param {This is the email of the user} users_email
 * @param {This is the county in which the user lives} users_county
 * @param {This is the town in which the user lives} users_town
 */
let create_new_user = function create_new_user(users_name, users_password, users_password_confirm, users_email, users_phone_number, users_county, users_town, users_skills) {
    const validator = require('validator');
    let validation_successful = false;

    if (validator.isEmail(users_email)) {
        if (validator.equals(users_password, users_password_confirm)) {
            if (validator.isMobilePhone('' + users_phone_number.replace(/\s/g, ''), ['en-IE'])) {
                if (users_skills.length >= 1) {
                    validation_successful = true;
                } else {
                    return "You need to enter at least 1 skill.";
                }
            } else {
                return "'" + validator.escape(users_phone_number) + "' is not a valid phone number.";
            }
        } else {
            return "'Password' and 'Confirm Password' do not match.";
        }
    } else {
        return "'" + validator.escape(users_email) + "' is not a valid email.";
    }

    let response;
    const users_password_hash = (users_password) => {
        return new Promise((resolve, reject) => {
            const bcrypt = require('bcrypt');
            const saltRounds = 10;

            bcrypt.hash(users_password, saltRounds, function (err, hash) {
                // Store hash in your password DB.
                resolve(hash);
            });
        });
    }

    const insert_user_into_db = (users_name, users_email, users_phone_number, users_county, users_town) => {
        return new Promise((resolve, reject) => {
            console.log("Inserting data...");
        });
    }

    const p12_certificate_response = () => {
        return new Promise(async (resolve, reject) => {
            const create_p12_certificate = require('../services/create_p12_certificate');
            const generator = require('generate-password');

            let users_certificate_password = generator.generate({
                length: 10,
                numbers: true
            });

            let response = await create_p12_certificate.create_user_certificate(users_name, "001", users_certificate_password, users_email, "IE", users_county, users_town, "01");

            if (response !== "Digital Certificate creation failed!") {
                resolve({ error: false, certificate_location: response, certificate_password: users_certificate_password });
            } else {
                reject({ error: true, response: response });
            }


        });
    }

    return Promise.all([users_password_hash(users_password), p12_certificate_response(), insert_user_into_db(users_name, users_email, users_phone_number, users_county, users_town)])
        .then((result) => {
            //Insert hashed password and file location into DB
            return JSON.stringify(result);
        }).catch((error) => {
            return JSON.stringify(error);
        });
}

exports.create_new_user = create_new_user;