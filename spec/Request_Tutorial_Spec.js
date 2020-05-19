let database = require('../services/database')
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
database_connection.connect();

describe('Request a tutorial', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 2000;
    });

    it('add_tutorial should return a success message', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(request_tutorial_res.debug_message).toBe("Post created successfully.");
        done();
    });
}); 