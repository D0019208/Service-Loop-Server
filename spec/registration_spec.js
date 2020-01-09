let registration = require('../services/registration/register');
let p12_cert_gen = require('../services/registration/create_p12_certificate')
let filter_registration_input = require('../services/registration/filter_registration_input')
let database = require('../services/database')

describe('Register a new user', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    }); 

    it('should return a success message once user created and updated after digital certificate creation', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect();
        let user_deleted_response = await database_connection.delete_user_by_email("D00192082@student.dkit.ie");

        let test_1_result = await registration.create_new_user("Nichita Postolachi", "12345aA@", "12345aA@", "D00192082@student.dkit.ie", "0899854571");

        expect(test_1_result).toBe('User updated successfully!');
        done();
    });

    it('should return an error message that the current email is in use', async function (done) {
        let test_2_result = await registration.create_new_user("Nichita Postolachi", "12345aA@", "12345aA@", "D00192082@student.dkit.ie", "0899854571");
        let test_2_result_response = test_2_result.response; 

        expect(test_2_result_response).toBe("The email 'D00192082@student.dkit.ie' is already taken. Please use a different email and try again.");
        done();
    });
});

describe('Create p12 certificate', function() {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    it('should return an error message when attempting to create a digital certificate', async function (done) {
        let test_3_result = await p12_cert_gen.create_user_certificate("5e00eff87738617a61b9dedc", "nu9dvYBqpz", "nikito888@gmail.com"); 

        expect(test_3_result).toBe("client_5e00eff87738617a61b9dedc already exists");
        done();
    });
});

describe('Filter registration input', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    it('should return an error message when the email is not a proper email', function () {
        let test_4_result = filter_registration_input.validate_registration_input("Nichita Postolachi", "12345aA@", "12345aA@", "a@a.a", "0899854571"); 
        let test_4_result_response = test_4_result.response; 

        expect(test_4_result_response).toBe("'a@a.a' is not a valid email.");
    });

    it('should return an error message when the password does not meet the strength criteria', function () {
        let test_5_result = filter_registration_input.validate_registration_input("Nichita Postolachi", "12345aA", "12345aA", "nikito888@gmail.com", "0899854571"); 
        let test_5_result_response = test_5_result.response; 

        expect(test_5_result_response).toBe("Password must contain a minimum of eight and maximum of 128 characters, at least one uppercase letter, one lowercase letter, one number and one special character.");
    });

    it('should return an error message when the "Password" and "Confirm Password" do not match', function () {
        let test_6_result = filter_registration_input.validate_registration_input("Nichita Postolachi", "12345aA@", "12345aA", "nikito888@gmail.com", "0899854571"); 
        let test_6_result_response = test_6_result.response; 

        expect(test_6_result_response).toBe("'Password' and 'Confirm Password' do not match.");
    });

    it('should return an error message as the entered phone number is not a valid Irish phone number', function () {
        let test_7_result = filter_registration_input.validate_registration_input("Nichita Postolachi", "12345aA@", "12345aA@", "nikito888@gmail.com", "089985457"); 
        let test_7_result_response = test_7_result.response; 

        expect(test_7_result_response).toBe("'089985457' is not a valid phone number.");
    });

    it('should return an error message as all fields must be filled in to proceed', function () {
        let test_8_result = filter_registration_input.validate_registration_input("Nichita Postolachi", "", "12345aA", "nikito888@gmail.com", "089985457"); 
        let test_8_result_response = test_8_result.response; 

        expect(test_8_result_response).toBe("Please fill in all required fields before proceeding.");
    });
});