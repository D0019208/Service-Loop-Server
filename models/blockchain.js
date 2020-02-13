const mongoose = require('mongoose');

const BlockchainSchema = new mongoose.Schema({
    post_id: {
        type: String,
        required: true
    },
    tutor_name: {
        type: String,
        required: true
    },
    tutor_email: {
        type: String,
        required: true
    },
    student_name: {
        type: String,
        required: true
    },
    student_email: {
        type: String,
        required: true
    },
    is_shared_blockchain: {
        type: Boolean,
        required: true
    },
    entry_accepted: {
        type: Boolean,
        required: true
    }
});

// UserSchema.methods.get_user_id = function get_user_id (email, cb) {
//       this.find({ email: email }).select('_id').exec(cb);
//   }

const blockchain = mongoose.model("blockchain", BlockchainSchema);
module.exports = blockchain;