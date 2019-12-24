const mongoose = require('mongoose');
const userModel = require('../models/users');

class database {
  constructor(user, key, database) {
    this.user = user;
    this.key = key;
    this.database = database;
  }

  connect() {
    return new Promise((resolve, reject) => {
      console.log("Connecting to database");

      mongoose.connection.on("connected", () => {
        resolve({ error: false, response: "Database has connected successfully." });
      });

      mongoose.connection.on("error", (error) => {
        reject({ error: true, response: error });
      });

      mongoose.connect('mongodb+srv://' + this.user + ':' + this.key + '@tutum-qips2.azure.mongodb.net/' + this.database + '?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });
    });
  }

  register_new_user(users_email, users_phone_number) {
    let newUser = new userModel();

    //Create New Users from Schema 'User.js' in models folder
    newUser.user_email = users_email;
    newUser.user_phone_number = users_phone_number;
    newUser.user_tutor = false;

    return new Promise((resolve, reject) => {
      newUser.save(function (err) {
        if (err) {
          console.log("Error adding new user")
          console.log(err);
          //return JSON.stringify({ error: true, response: err });
          reject({ error: true, response: err });
        } else {
          console.log("User added")
          //return JSON.stringify({ error: false, response: "New user registered successfully." });
          resolve({ error: false, response: "New user registered successfully." });
        }
      });
    });
  }

  update_new_users_details(doc_filter, password, digital_certificate_path, digital_certificate_password) {
    const filter = { user_email: doc_filter };
    const update = { user_password: password, user_digital_certificate_path: digital_certificate_path, user_digital_certificate_password: digital_certificate_password };

    return new Promise((resolve, reject) => {
      userModel.findOneAndUpdate(filter, update).then(result => {
        resolve("User updated successfully!")
      })
        .catch((exception) => {
          reject({ error: true, response: exception })
        });
    });
  }

  find_id_by_email(email) {
    return new Promise((resolve, reject) => {
      userModel.findOne({ user_email: email })
        .then((newUser) => {
          if (newUser) {
            resolve({ error: false, response: newUser });
          } else {
            if (newUser === null) {
              resolve({ error: false, response: "No user found!" });
            } else {
              reject({ error: true, response: newUser });
            }
          }
        }).catch((exception) => {
          reject({ error: true, response: exception })
        });
    });
  }

  delete_user_by_email(email) {
    return new Promise((resolve, reject) => {
      userModel.findOneAndRemove({ user_email: email })
        .then((err, newUser) => { 
            resolve({error: false, response: "User deleted successfully"}) 
        }).catch((exception) => { 
          console.log("Exception has occured")
          console.log(exception)
          reject({ error: true, response: exception })
        });
    });
  }
}

//mongoose.Promise = global.Promise;
//mongodb+srv://Tutum_Nichita:EajHKuViBCaL62Sj@tutum-qips2.azure.mongodb.net/service_loop?retryWrites=true&w=majority

module.exports = database;

