let registration = require('../services/registration/register');
let database = require('../services/database')
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
database_connection.connect();

describe('Apply to be a tutor', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    }); 

    it('should return a success message once user created and updated after digital certificate creation', async function (done) {
        let user_deleted_response = await database_connection.delete_user_by_email("D00192082@student.dkit.ie");
        await database_connection.delete_user("D001920822@student.dkit.ie");

        let new_user = await registration.create_new_user("Nichita Postolachi", "12345aA@", "12345aA@", "D001920822@student.dkit.ie", "0899854571", database_connection);


        let elevated_student = await database_connection.elevate_user_to_tutor("D001920822@student.dkit.ie", ["JavaScript"], "");


        database_connection.delete_user("D001920822@student.dkit.ie");
        expect(elevated_student.response).toBe('User elevated successfully!');
        done();
    });
});