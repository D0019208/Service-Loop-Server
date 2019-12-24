const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  user_email: {
    type: String,
    required: true
  },
  user_phone_number:
  {
      type: String,
      required: true
  },
  user_tutor:
  {
    type: Boolean,
    required: true
  },
  user_password:{
    type:String
  },
  
  user_digital_certificate_path: 
  {
    type: String
  },
  user_digital_certificate_password:
  {
    type: String
  }
});

// UserSchema.methods.get_user_id = function get_user_id (email, cb) {
//       this.find({ email: email }).select('_id').exec(cb);
//   }

const User = mongoose.model("Users", UserSchema);
module.exports = User;