let database = require('../services/database');
const login = require('../services/login');
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
database_connection.connect();

describe('Login', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    });

    it('check_user_credentials should return a success message', async function (done) {
        let check_credentials_res = await login.check_user_credentials("nikito888@gmail.com", "12345aA@", database_connection)

        expect(check_credentials_res.debug_message).toBe("Password correct");
        done();
    });

    it('check_user_credentials should return an error message', async function (done) {
        let check_credentials_res = await login.check_user_credentials("nikito888@gmail.com", "1235aA@", database_connection)

        expect(check_credentials_res.debug_message).toBe("Password wrong");
        done();
    });

    it('check_user_credentials should return false if no user has been found', async function (done) {
        let check_credentials_res = await login.check_user_credentials("nikito88@gmail.com", "1235aA@", database_connection)

        expect(check_credentials_res).toBe(false);
        done();
    });

    it('login_user should return an error message', async function (done) {
        let login_user_res = await login.login_user("nikito88@gmail.com", "1235aA@", database_connection)

        expect(login_user_res.error).toBe('Email or password is incorrect.');
        done();
    });

    it('login_user should return a success message and token', async function (done) {
        let login_user_res = await login.login_user("nikito888@gmail.com", "12345aA@", database_connection)

        expect(login_user_res.result).toBe('Login successful.');
        done();
    });
}); 