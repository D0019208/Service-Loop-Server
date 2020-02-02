console.log('Example app started!')
var XooaClient = require("xooa-sdk");
var xooaClient = new XooaClient();
xooaClient.setApiToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBcGlLZXkiOiJZTjdXMUowLUpINk1CVjctTkRUWEEzTi04NEJYWU1XIiwiQXBpU2VjcmV0IjoiWkJzMGVwWTdCWFlQVm9QIiwiUGFzc3BocmFzZSI6IjIxZTI4MDlkOGI5NjBlNWIyMjkxYzY2YmEzYjMzNDdjIiwiaWF0IjoxNTgwMzk2MDk3fQ.WJNZnfXuATzZLdfVBKwyI3tiKY_JFehyPC6LQ0kaMSU");

 async function add_new_identity_to_blockchain(identity_name, name, value) {
 	var newIdentity = {
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

 var [error, pendingResponse, data] = await xooaClient.enrollIdentity({}, newIdentity)
 console.log(error, pendingResponse, data);
 }


//Set a value in blockchain
async function add_transaction_to_blockchain(data_to_add) {
  var [error, pendingResponse, data] = await xooaClient.invoke("add_transaction", {}, { args: data_to_add})
  console.log(error, pendingResponse, data);
}

//Get a value FROM blockchain
async function get_from_blockchain_by_tx_id(tx_id) {
  var [error, pendingResponse, data] = await xooaClient.getTransactionByTransactionId(tx_id, {});
  console.log(data);
}

async function get_from_blockchain_by_block_number(block_number) {
  var [error, pendingResponse, data] = await xooaClient.getBlockByNumber(block_number, {});
console.log(error, pendingResponse, data);
}

async function get_by_key() {
  var [error, pendingResponse, data] = await xooaClient.invoke("get_by_key", {}, { args: ["CA2", "This is a test for CA2"] });
console.log(error, pendingResponse, data);
}

add_new_identity_to_blockchain("Frank Keenan User", "Frank Keenan", "")
//get_from_blockchain_by_block_number("66");
//get_from_blockchain_by_tx_id('f2caf767581ac753b709262e514662ca9812401a22bea2276ff34c7a688adf17')
//add_transaction_to_blockchain(["CA2", "This is a test for CA2"]);
//get_by_key();