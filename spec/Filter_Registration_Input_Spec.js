let database = require('../services/database')
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
database_connection.connect();

describe('filter_registration_input', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    });

    it('validate_registration_input should return an object containing the JWT token and a success message', async function (done) {
        const login = require('../services/login');

        let login_res = await login.check_user_credentials("nikito888@gmail.com", "12345aA@", database_connection);

        expect(login_res.password_matches).toBe(true);
        done();
    });

    it('validate_registration_input should return an object containing an error message', async function (done) {
        const login = require('../services/login');

        let login_res = await login.check_user_credentials("nikito888@gmail.com", "12345aA", database_connection);

        expect(login_res.password_matches).toBe(false);
        done();
    });

    it('validate_registration_input should return an object containing an error message when the user already exists', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345aA@", "12345aA@", "nikito888@gmail.com", "0899854571", database_connection);

        expect(filtering_response.response).toBe('The email \'nikito888@gmail.com\' is already taken. Please use a different email and try again.');
        done();
    });

    it('validate_registration_input should return an object containing a success message', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345aA@", "12345aA@", "nikito8888@gmail.com", "0899854571", database_connection);

        expect(filtering_response.response).toBe('Proceed.');
        done();
    });

    it('validate_registration_input should return an object containing an error message when passwords do not match', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345aA@", "12345aA", "nikito8888@gmail.com", "0899854571", database_connection);

        expect(filtering_response.response).toBe('\'Password\' and \'Confirm Password\' do not match.');
        done();
    });

    it('validate_registration_input should return an object containing an error message when one field is empty', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345aA@", "12345aA@", "", "0899854571", database_connection);

        expect(filtering_response.response).toBe('Please fill in all required fields before proceeding.');
        done();
    });

    it('validate_registration_input should return an object containing an error message when the email is incorrect', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345aA@", "12345aA@", "s", "0899854571", database_connection);

        expect(filtering_response.response).toBe('\'s\' is not a valid email.');
        done();
    });

    it('validate_registration_input should return an object containing an error message when the password is too weak', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345A@", "12345A@", "nikito8888@gmail.com", "0899854571", database_connection);

        expect(filtering_response.response).toBe('Password must contain a minimum of eight and maximum of 128 characters, at least one uppercase letter, one lowercase letter, one number and one special character.');
        done();
    });

    it('validate_registration_input should return an object containing an error message when the phone number is the wrong format', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345Aa@", "12345Aa@", "nikito8888@gmail.com", "08998571", database_connection);

        expect(filtering_response.response).toBe('\'08998571\' is not a valid phone number.');
        done();
    });

    it('validate_registration_input should return an object containing an error message when the phone number is the wrong format', async function (done) {
        const validator = require('validator');
        const filter_registration_input = require('../services/registration/filter_registration_input');
        //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)

        let filtering_response = await filter_registration_input.validate_registration_input(validator.escape("John Doe"), "12345Aa@", "12345Aa@", "nikito8888@gmail.com", "08998571", database_connection);

        expect(filtering_response.response).toBe('\'08998571\' is not a valid phone number.');
        done();
    });




    it('validate_password_input should return an object containing a success message', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_password_input("nikito888@gmail.com", "12345aA@", "12345aA@");

        expect(filtering_response.response).toBe('valid');
        done();
    });

    it('validate_password_input should return an object containing an error message when a field is empty', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_password_input("nikito888@gmail.com", "", "12345aA@");

        expect(filtering_response.response).toBe('Field is empty');
        done();
    });

    it('validate_password_input should return an object containing an error message when the passwords do not match', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_password_input("nikito888@gmail.com", "12345aA", "12345aA@");

        expect(filtering_response.response).toBe('\'Password\' and \'Confirm Password\' do not match.');
        done();
    });

    it('validate_password_input should return an object containing an error message when the password is too weak', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_password_input("nikito888@gmail.com", "12345a@", "12345a@");

        expect(filtering_response.response).toBe('Password must contain a minimum of eight and maximum of 128 characters, at least one uppercase letter, one lowercase letter, one number and one special character.');
        done();
    });

    it('validate_password_input should return an object containing an error message when the email is wrong format', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_password_input(".com", "12345a@", "12345a@");

        expect(filtering_response.response).toBe('\'.com\' is not a valid email.');
        done();
    });





    it('validate_user_phone should return an object containing a success message', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_user_phone("0899854571");

        expect(filtering_response.response).toBe('valid');
        done();
    });

    it('validate_user_phone should return an object containing an error message when the phone number is left blank', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_user_phone("");

        expect(filtering_response.response).toBe('Phone number must no be left empty');
        done();
    });

    it('validate_user_phone should return an object containing an error message when the phone number is wrong format', async function (done) {
        const filter_registration_input = require('../services/registration/filter_registration_input');

        let filtering_response = await filter_registration_input.validate_user_phone("2322");

        expect(filtering_response.response).toBe('\'2322\' is not a valid phone number.');
        done();
    });
}); 