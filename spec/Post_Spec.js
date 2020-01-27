let database = require('../services/database')

describe('Loading all tutorials', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should have an object containing all posts and have the error flag set to false', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let result = await database_connection.add_tutorial("Test", "Test", ["JavaScript", "PHP"], "D00192082@student.dkit.ie");
        db_con_response = await database_connection.connect(); 
        let test_1_result = await database_connection.get_all_elegible_posts("D00192082@student.dkit.ie", ["JavaScript", "PHP"]);

console.log("saaf")
        console.log(test_1_result);
        expect(test_1_result.error).toBe(false);
        done();
    }); 

    it('should return a success message once a user requests a tutorial and recieves a notification', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let result = await database_connection.delete_posts_by_email("D00192082@student.dkit.ie");
        let test_2_result = await database_connection.get_all_elegible_posts("D00192082@student.dkit.ie", ["", ""]);

        expect(test_2_result.response).toBe("There are no posts to display!");
        done();
    }); 
}); 

describe('Setting a posts status', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function() {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return no error', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let result = await database_connection.add_tutorial("Test", "Test", ["JavaScript", "PHP"], "D00192082@student.dkit.ie");

        db_con_response = await database_connection.connect(); 
        let test_1_result = await database_connection.accept_post("D00192082@student.dkit.ie", result.response[0]._id);

        expect(test_1_result.error).toBe(false);
        done();
    }); 

    it('should return an error when a post is not available', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let result = await database_connection.add_tutorial("Test", "Test", ["JavaScript", "PHP"], "D00192082@student.dkit.ie");
        //result._id is wrong syntax, still tests code however
        let buffer = await database_connection.accept_post("D00192082@student.dkit.ie", result._id);
        let test_2_result = await database_connection.accept_post("D00192082@student.dkit.ie", result._id);

        expect(test_2_result.response).toBe("The post you wish to tutor is no longer available!");
        done();
    }); 
}); 