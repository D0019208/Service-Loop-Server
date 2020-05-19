
const verify_jwt_controller = require('../services/verify_jwt');
let database = require('../services/database')
const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
database_connection.connect();

describe('Verify JSON Webtoken', function () {
    beforeEach(function() { 
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 20000;
    }); 

    it('should return false when JWT is expired', async function (done) {
        let is_session_valid = await verify_jwt_controller.verify_jwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmlraXRvODg4J2dtYWlsLmNvbSIsImlhdCI6MTU4OTgxNzY1MSwiZXhwIjoxNTg5ODE3NzExLCJpc3MiOiJodHRwczovL3N0dWRlbnRsb29wLmNvbSJ9.Z2P3FM7GBYb9dtSi5nGP1soOcy5vgFNE0bwqpS-iQGY", "nikito888@gmail.com");

        expect(is_session_valid.session_valid).toBe(false);
        done();
    });

    it('should return true when JWT is NOT expired', async function (done) {
        let is_session_valid = await verify_jwt_controller.verify_jwt("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoibmlraXRvODg4QGdtYWlsLmNvbSIsImlhdCI6MTU4OTg2MTM2MSwiZXhwIjoxNjIxMzk3MzYxLCJpc3MiOiJodHRwczovL3N0dWRlbnRsb29wLmNvbSJ9.AuzssDGMydwIpMrpqyuUaJyFtGwb92XWd3SKpt9VUuA", "nikito888@gmail.com");

        expect(is_session_valid.session_valid).toBe(true);
        done();
    });
});