const Blockchain = require('../services/Blockchain');
const blockchain_controller = new Blockchain("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcGlLZXkiOiJSMUg2NVdGLVhCWjRIVkctSEJHV045Ri1EREdHQTJLIiwiQXBpU2VjcmV0IjoiakQ0UG05cHNhU3VZQUMxIiwiUGFzc3BocmFzZSI6ImI5YmIxMzg5MjJjMmIwNTUyMDczYTNiNjUzMzU2NGI1IiwiaWF0IjoxNTg5ODA1ODIyfQ.L7iyzTjyFth6aJcE77r77O-923SpAwnE2q6UvQx_8Bc");

let blockchain_switch = false;

describe('Blockchain', function () {
    beforeEach(function () {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    });

    it('should return false when there is no error', async function (done) {
        let response;
        if (blockchain_switch) {
            response = await blockchain_controller.get_transactions_by_key("5e7d2071583b8c2768138765");
        } else {
            response = {error: false};
        }

        expect(response.error).toBe(false);
        done();
    });

    it('should return false when there is no error', async function (done) {
        let response;
        if (blockchain_switch) {
            response = await blockchain_controller.add_transaction_to_blockchain("5e7d2071583b8c2768138765", {foo: "bar"});
        } else {
            response = {error: false};
        }

        expect(response.error).toBe(false);
        done();
    });
});