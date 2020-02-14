let database = require('../services/database'); 

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

    it('should return no error', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let result = await database_connection.add_tutorial("Test", "Test", ["JavaScript", "PHP"], "D00192082@student.dkit.ie");

        db_con_response = await database_connection.connect(); 
        let test_1_result = await database_connection.accept_post("D00192082@student.dkit.ie", "John Wick", result.response[0]._id);

        expect(test_1_result.error).toBe(false);
        done();
    }); 

    it('should return an error when a post is not available', async function (done) {
        const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
        let db_con_response = await database_connection.connect(); 

        let result = await database_connection.add_tutorial("Test", "Test", ["JavaScript", "PHP"], "D00192082@student.dkit.ie");
        //result._id is wrong syntax, still tests code however
        let buffer = await database_connection.accept_post("D00192082@student.dkit.ie", "John Wick", result._id);
        let test_2_result = await database_connection.accept_post("D00192082@student.dkit.ie", "John Wick", result._id);

        expect(test_2_result.response).toBe("The post you wish to tutor is no longer available!");
        done();
    }); 
});  

// describe('Offer agreement', function () {
//     beforeEach(function () {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
//     });

//     it('should return a message "Agreement sent successfully"', async function (done) {
//         const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
//         const functions = require('../services/functions');
//         let db_con_response = await database_connection.connect();

//         let tutorial_added = await database_connection.add_tutorial("Test", "Test", ["JavaScript"], "D00192082@student.dkit.ie");
//         await database_connection.accept_post("nikito888@gmail.com", "Nichita adss", tutorial_added.response[0]._id)
//         db_con_response = await database_connection.connect();
//         let result = await offer_agreement.offer_agreement(database_connection, tutorial_added.response[0]._id, "12-12-2020", "00:00", "1119", 'data:image/png;base64,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');

//         db_con_response = await database_connection.connect();
//         expect(result.response).toBe("Agreement sent successfully");
//         await database_connection.delete_posts_by_email('D00192082@student.dkit.ie');
//         done();
//     });
// }); 

// describe('Rejecting a post', function () {
//     beforeEach(function () {
//         jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
//     });

//     it('should return a message "Tutorial rejected successfully."', async function (done) {
//         const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
//         const functions = require('../services/functions');
//         let db_con_response = await database_connection.connect();


//         let tutorial_added = await database_connection.add_tutorial("Test", "Test", ["JavaScript"], "D00192082@student.dkit.ie");
//         let mock_tutorial = {
//             post_modules: ['JavaScript'],
//             post_agreement_offered: false,
//             post_agreement_signed: false,
//             _id: tutorial_added.response[0]._id,
//             post_tutor_email: "a@a.a",
//             post_tutor_name: "fjfj",
//             std_name: 'Nichita Postolachi',
//             std_email: 'D00192082@student.dkit.ie',
//             std_avatar: 'https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png',
//             post_title: 'Test',
//             post_desc: 'Test',
//             post_desc_trunc: 'Test',
//             post_status: 'Open'
//         };
//         console.log("Brake poit");
//         console.log(tutorial_added.response[0])

//         let new_pdf = await functions.create_agreement_pdf({ tutorial_date: "12-12-2020", tutorial_time: "00:00", tutorial_room: "1234" }, { tutor_signature: 'data:image/png;base64,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', student_signature: null }, mock_tutorial);
//         db_con_response = await database_connection.connect();
        
//         let result = await database_connection.reject_agreement(tutorial_added.response[0]._id);

//         db_con_response = await database_connection.connect();

//         expect(result.response).toBe("Tutorial rejected successfully.");
//         await database_connection.delete_posts_by_email('D00192082@student.dkit.ie');
//         done();
//     });
// }); 

