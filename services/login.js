"use strict";

/**
 * This is the function that will check the users credentials when logging in.
 * It checks to see if the plaintext password of the user is the same as the password hash 
 * 
 * @param {String} users_email
 * @param {String} users_password 
 */

let check_user_credentials = async function check_user_credentials(users_email, users_password, database_connection) {
    const bcrypt = require('bcrypt');
    let result = {}; 

    let password_hash = await database_connection.find_id_by_email(users_email);

    if (password_hash.response === "No user found!") {
        return false;
    } else {
        let password_correct = await bcrypt.compare(users_password, password_hash.response.user_password)

        if(password_correct) {
           return {password_matches: password_correct, user: password_hash}; 
        } else {
            return {password_matches: password_correct}
        }
        
    }

}

/**
 * This is the function that will login a user, we hash the users password and check
 * to see that the generated hash matches the password hash created when registering.
 * 
 * If successful, we will create a JWT (JsonWebToken) to act as our session 
 * 
 * @param {String} users_email
 * @param {String} users_password 
 */
let login_user = async function login_user(users_email, users_password, database_connection) { 
    const jwt = require('jsonwebtoken');
    let result = {};
    //process.env.JWT_SECRET
    let JWT_SECRET = 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';

    //Call a function to compare the plaintext password of the user against the hash from the database
    let password_correct = await check_user_credentials(users_email, users_password, database_connection);

    //If the passwords match, we create the JWT
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