let registration = require('../services/registration/register');
let p12_cert_gen = require('../services/registration/create_p12_certificate');
let database = require('../services/database')
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
database_connection.connect();

describe('Register a new user', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    }); 

    it('should return a success message once user created and updated after digital certificate creation', async function (done) {
        let user_deleted_response = await database_connection.delete_user_by_email("D00192082@student.dkit.ie");
        await database_connection.delete_user("D001920822@student.dkit.ie");

        let test_1_result = await registration.create_new_user("Nichita Postolachi", "12345aA@", "12345aA@", "D001920822@student.dkit.ie", "0899854571", database_connection);

        database_connection.delete_user("D001920822@student.dkit.ie");

        expect(test_1_result).toBe('User updated successfully!');
        done();
    });
});

describe('Create p12 certificate', function() {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    });

    it('should return an error message when attempting to create a digital certificate', async function (done) {
        let test_3_result = await p12_cert_gen.create_user_certificate("5e00eff87738617a61b9dedc", "nu9dvYBqpz", "nikito888@gmail.com"); 

        expect(test_3_result).toBe("client_5e00eff87738617a61b9dedc already exists");
        done();
    });
});