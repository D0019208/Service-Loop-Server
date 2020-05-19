const functions = require('../services/functions');

describe('Agreement', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    it('Accept agreement should return no errors', async function (done) {
        let pdf_path_and_name = await functions.create_agreement_pdf({ tutorial_date: "12/12/2020", tutorial_time: "20:20" }, { tutor_signature: "data:image/png;base64,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", student_signature: null }, {_id: "ASDJSAKDSA", post_tutor_name: "Nichita Postolachi", post_tutor_email: "nikito888@gmail.com", std_name: "John Doe", std_email: "micko3722@gmail.com", post_title: "Unit test title", post_desc: "Unit test desc", post_modules: ["JavaScript"]});

        expect(pdf_path_and_name.pdf_path).toBe("resources/pdfs/agreement_ASDJSAKDSA.pdf");
        done();
    });
});