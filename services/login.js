"use strict";

/**
 * This is the function that will login a user, we hash the users password and check
 * to see that the generated hash matches the password hash created when registering.
 * 
 * Will consider adding 2-factor authentication at some point.
 * 
 * @param {This is the email of the user} users_email
 * @param {This is the password of the user which we will/have hashed} users_password 
 */

let check_user_credentials = async function check_user_credentials(users_email, users_password) {
    const bcrypt = require('bcrypt');
    let result = {};

    const database = require('./database');
    const database_connection = new database("Tutum_Nichita", process.env.MONGOOSE_KEY, "service_loop");
    let database_connect_response = await database_connection.connect();

    let password_hash = await database_connection.find_id_by_email(users_email);

    if (password_hash.response === "No user found!") {
        return false;
    } else {
        return {password_matches: await bcrypt.compare(users_password, password_hash.response.user_password), user: password_hash};
    }

}

let login_user = async function login_user(users_email, users_password) { 
    const jwt = require('jsonwebtoken');
    let result = {};
    //process.env.JWT_SECRET
    let JWT_SECRET = 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';


    let password_correct = await check_user_credentials(users_email, users_password);

    if (password_correct.password_matches) {
        const payload = { user: users_email };
        const options = { expiresIn: '1h', issuer: 'https://serviceloop.com' };
        const secret = JWT_SECRET;
        const token = jwt.sign(payload, secret, options);

        // console.log('TOKEN', token);
        result.token = token;
        result.status = 200;
        result.result = 'Login successful.';
        
        result.user_name = password_correct.user.response.users_full_name;
        result.user_tutor = password_correct.user.response.user_tutor;
        if(result.user_tutor) {
            result.user_modules = password_correct.user.response.user_modules;
        }

        return result;
    } else {
        result.status = 401;
        result.error = 'Email or password is incorrect.';
        return result;
    }
}

exports.login_user = login_user;
exports.check_user_credentials = check_user_credentials;