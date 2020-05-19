const database = require('../services/database');
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
let db_con_response = database_connection.connect();

describe(' find user by email', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should have an return user with false error in promise', async function (done) {
        let user = await database_connection.find_id_by_email('d00167295@student.dkit.ie');

        expect(user.error).toBe(false);
        done();
    });

});

// describe(' delete user by email', function () {
//     beforeEach(function() { 
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
//     });

//     afterEach(function() {
//         //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
//         //database_connection.disconnect();
//     });

//     it('should have an object containing all posts and have the error flag set to false', async function (done) {
//         const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
//         let db_con_response = await database_connection.connect(); 

//         await database_connection.delete_user_by_email('d00167295@student.dkit.ie');
//         let user = await database_connection.find_id_by_email('d00167295@student.dkit.ie');


//         expect(user.error).toBe(true);
//         done();
//     }); 

// }); 

describe(' get user name by email', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return name of user', async function (done) {
        let user = await database_connection.getNameByEmail('d00167295@student.dkit.ie');


        expect(user.users_full_name).toBe("Jhon Lennon");
        done();
    });

});

describe('get all users tutorials', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return all tutorials for tutor', async function (done) {
        let tut = await database_connection.get_all_users_tutorials('d00167295@student.dkit.ie');


        expect(tut.error).toBe(false);
        done();
    });

});


describe(' get user name by email', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return name of user', async function (done) {
        let tut = await database_connection.get_all_users_tutorials('d00167295@student.dkit.ie');

        expect(tut.error).toBe(false);
        done();
    });

});


describe(' get post by id', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return error false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        let post = await database_connection.get_notification_posts(request_tutorial_res.response[0]._id);

        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.error).toBe(false);
        done();
    });

});

describe(' check_if_action_is_available', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    it('cancel tutorial should return action_available true', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        let post = await database_connection.action_available("cancel", request_tutorial_res.response[0]._id);

        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(true);
        done();
    });

    it('cancel tutorial should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("cancel", request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });

    it('offer agreement should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        
        let post = await database_connection.action_available("offer_agreement", request_tutorial_res.response[0]._id);
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });

    it('offer_agreement should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("offer_agreement", request_tutorial_res.response[0]._id);
        

        expect(post.action_available).toBe(false);
        done();
    });

    it('reject_agreement should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        
        let post = await database_connection.action_available("reject_agreement", request_tutorial_res.response[0]._id);
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });

    it('reject_agreement should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("reject_agreement", request_tutorial_res.response[0]._id);
        

        expect(post.action_available).toBe(false);
        done();
    });

    it('reject_agreement should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        
        let post = await database_connection.action_available("accept_agreement", request_tutorial_res.response[0]._id);
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });
    
    it('accept_agreement should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("accept_agreement", request_tutorial_res.response[0]._id);
        

        expect(post.action_available).toBe(false);
        done();
    });

    it('begin_tutorial should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        
        let post = await database_connection.action_available("begin_tutorial", request_tutorial_res.response[0]._id);
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });
    
    it('begin_tutorial should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("begin_tutorial", request_tutorial_res.response[0]._id);
        

        expect(post.action_available).toBe(false);
        done();
    });

    it('end_tutorial should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        
        let post = await database_connection.action_available("end_tutorial", request_tutorial_res.response[0]._id);
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });
    
    it('end_tutorial should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("end_tutorial", request_tutorial_res.response[0]._id);
        

        expect(post.action_available).toBe(false);
        done();
    });

    it('rate should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        
        let post = await database_connection.action_available("rate", request_tutorial_res.response[0]._id);
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(post.action_available).toBe(false);
        done();
    });
    
    it('rate should return action_available false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");
        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);
        let post = await database_connection.action_available("rate", request_tutorial_res.response[0]._id);
        

        expect(post.action_available).toBe(false);
        done();
    });

    

});

// describe(' check room avalibility', function () {
//     beforeEach(function() { 
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
//     });

//     afterEach(function() {
//         //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
//         //database_connection.disconnect();
//     });

//     it('should return error false', async function (done) {
//         const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
//         let db_con_response = await database_connection.connect(); 

//         let post = await database_connection.check_room_availability();


//         expect(post.error).toBe(false);
//         done();
//     }); 

// }); 

describe(' change users phone', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return error false', async function (done) {
        let user = await database_connection.change_user_phone("d00167295@student.dkit.ie", "0861259274");

        expect(user.error).toBe(false);
        done();
    });

});


describe(' get post status', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    afterEach(function () {
        //const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        //database_connection.disconnect();
    });

    it('should return error false', async function (done) {
        let request_tutorial_res = await database_connection.add_tutorial("Unit test title", "Unit test description", ["JavaScript"], "nikito888@gmail.com", "https://d00192082.alwaysdata.net/resources/images/base_user.jpg", "");

        let user = await database_connection.get_post_status(request_tutorial_res.response[0]._id);

        database_connection.delete_tutorial(request_tutorial_res.response[0]._id);

        expect(user.error).toBe(false);
        done();
    });

}); 