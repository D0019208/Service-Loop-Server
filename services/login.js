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
let login_user = async function login_user(users_email, users_password) {
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    let result = {};
    //process.env.JWT_SECRET
    let JWT_SECRET= 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';


    let password_correct = await bcrypt.compare(users_password, '$2b$10$uHVc0v7KX9OsWvWaYYkF7emkPe.hCuv9aTzgkO24X5JwP1IbKxW1e');

    if (password_correct) {
        const payload = { user: users_email };
        const options = { expiresIn: '30m', issuer: 'https://serviceloop.com' };
        const secret = JWT_SECRET;
        const token = jwt.sign(payload, secret, options);

        // console.log('TOKEN', token);
        result.token = token;
        result.status = 200;
        result.result = 'Login successful.';

        return result;
    } else { 
        result.status = 401;
        result.error = 'Email or password is incorrect.';
        return result; 
    }
}

exports.login_user = login_user;