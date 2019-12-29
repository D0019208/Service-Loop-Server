"use strict";

/**
 * This is the function that will be called to create a new user and generate a Digital Certificates
 * for the user. It takes 5 parameters and firstly creates the certificate asynchronously 
 * while the rest of the function logs the information to the database.
 * 
 * @param {This is the full name of the user} users_name 
 * @param {This is the password of the user which we have hashed} users_password 
 * @param {This is the email of the user} users_email
 */
let create_new_user = async function create_new_user(users_full_name, users_password, users_password_confirm, users_email, users_phone_number) { 
    const users_password_hash = (users_password) => {
        return new Promise((resolve, reject) => {
            const bcrypt = require('bcrypt');
            const saltRounds = 10;

            bcrypt.hash(users_password, saltRounds, function (err, hash) {
                // Store hash in your password DB.
                console.log("gg")
                resolve({ error: false, response: hash, type: "password_hash" });
            });
        });
    }

    const insert_user_into_db = (database_connection, users_full_name, users_email, users_phone_number) => {
        return new Promise(async (resolve, reject) => {
            //resolve({ error: false, response: "New user registered successfully." });
            //return;
            let response = await database_connection.register_new_user(users_full_name, users_email, users_phone_number);

            if (response.error) {
                console.log(err);
                reject({ error: true, response: err });
            } else {
                console.log("Success")
                resolve({ error: false, response: "New user registered successfully." });
            }
        });
    }

    const p12_certificate_response = (database_connection, users_full_name, users_email) => {
        return new Promise(async (resolve, reject) => {
            const create_p12_certificate = require('./create_p12_certificate');
            const generator = require('generate-password');

            let users_certificate_password = generator.generate({
                length: 10,
                numbers: true
            });

            //Initialize model and get ID of email
            try {
                let find_user_id_results = await database_connection.find_id_by_email(users_email);

                if (find_user_id_results.error) {
                    resolve({ error: true, response: find_user_id_results.response });
                } else {
                    if (find_user_id_results.response === "No user found!") {
                        resolve({ error: true, response: find_user_id_results.response });
                    } else {
                        let user_id = find_user_id_results.response._id;
                        
                        //Consider looking into wtf is a serial number
                        let response = await create_p12_certificate.create_user_certificate(user_id, users_certificate_password, users_email, users_full_name);

                        //let response = "IDK";
                        if (response !== "Digital Certificate creation failed.") {
                            resolve({ error: false, certificate_location: response, certificate_password: users_certificate_password, type: "digital_certificate" });
                        } else {
                            resolve({ error: true, response: response });
                        }
                    }
                }
             } catch (err) {
                database_connection.disconnect();
                
                 console.log(err)
                 resolve({ error: true, response: err });
             }
        });
    }








    //Setup the user data validation
    const validator = require('validator');
    const filter_registration_input = require('./filter_registration_input');

    //Valiate user data
    let filtering_response = await filter_registration_input.validate_registration_input(users_full_name, users_password, users_password_confirm, users_email, users_phone_number);

    if (filtering_response.error) {
        console.log("Exit")
        return filtering_response;
    }

    //Setup database connection and model for registrating new user
    const database = require('../database');
    const database_connection = new database("Tutum_Nichita", process.env.MONGOOSE_KEY, "service_loop");

    try {
        let database_connect_response = await database_connection.connect();

        console.log(database_connect_response);

        let user_insert_response = await insert_user_into_db(database_connection, users_full_name, users_email, users_phone_number);

        if (!user_insert_response.error) {
            let promise_array = [users_password_hash(users_password), p12_certificate_response(database_connection, users_full_name, users_email)];

            return Promise.all(promise_array)
                .then(async result => { 

                    let password_hash;
                    let digital_certificate_path;
                    let digital_certificate_password;

                    for(let i = 0; i < result.length; i++) {
                        if(result[i].type === "digital_certificate") {
                            digital_certificate_path = result[i].certificate_location;
                            digital_certificate_password = result[i].certificate_password;
                        } else if(result[i].type === "password_hash") {
                            password_hash = result[i].response;
                        }
                    }
                    
                    let update_response = await database_connection.update_new_users_details(users_email, password_hash, digital_certificate_path, digital_certificate_password);
                    database_connection.disconnect();
                    return update_response;
                })
                .catch((error) => {
                    database_connection.disconnect();
                    console.log("Promises rejected")
                    return {error: true, response: "error"};
                });
        } else {
            database_connection.disconnect();
            console.log(user_insert_response.response);
            return;
        }

    } catch (ex) {
        console.log(ex);
        return;
    }
}

exports.create_new_user = create_new_user;