let database = require('../services/database')

describe('Applying to be a tutor', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        database_connection.disconnect();
    });

    it('should return a success message once a user has been elevated to a tutor', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let test_1_result = await database_connection.elevate_user_to_tutor("nikito888@gmail.com", ["JavaScript", "PHP"]);

        expect(test_1_result.response).toBe('User elevated successfully!');
        done();
    }); 

    it('should return a success message once a user requests a tutorial and recieves a notification', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let test_1_result = await database_connection.add_tutorial("JavaScript if statements", "Hi, I am currently failing my 3rd year of DkIT, I desperately need JavaScript lessons about if statements :(", ["JavaScript", "PHP"], "D00192082@student.dkit.ie");
        await database_connection.delete_post_by_email("D00192082@student.dkit.ie");
        await database_connection.delete_notifications_by_email("D00192082@student.dkit.ie");
        await database_connection.delete_notifications_by_modules(["JavaScript", "PHP"]);

        expect(test_1_result.debug_message).toBe('Post created successfully.'); 
        done();
    }); 
}); 