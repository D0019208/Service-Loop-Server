class Blockchain {
    constructor(api_key) {
        const XooaClient = require("xooa-sdk");
        this.blockchain = new XooaClient();
        this.blockchain.setApiToken(api_key);
    }

    async add_new_identity_to_blockchain(identity_name, name, value) {
        let newIdentity = {
            "IdentityName": identity_name,
            "Access": "r",
            "Attrs": [
                {
                    "name": name,
                    "ecert": true,
                    "value": value
                }
            ],
            "canManageIdentities": false
        }

        let [error, pendingResponse, data] = await this.blockchain.enrollIdentity({}, newIdentity);
        console.log(error, pendingResponse, data);

        if(error == null && typeof pendingResponse == 'undefined') {
            return {error: false, response: data};
        } else {
            return {error: true, response: error};
        }
    }

    // async add_entry_to_shared_blockchain() {

    // }
}

module.exports = Blockchain;