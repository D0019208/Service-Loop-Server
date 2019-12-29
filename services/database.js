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
      
      String.prototype.trunc =
        function (n, useWordBoundary) {
          if (this.length <= n) { return this; }
          var subString = this.substr(0, n - 1);
          return (useWordBoundary
            ? subString.substr(0, subString.lastIndexOf(' '))
            : subString) + "&hellip;";
        };

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

  disconnect() {
    mongoose.connection.close();
  }

  register_new_user(users_full_name, users_email, users_phone_number) {
    let newUser = new userModel();

    //Create New Users from Schema 'User.js' in models folder
    newUser.users_full_name = users_full_name;
    newUser.user_email = users_email;
    newUser.user_phone_number = users_phone_number;
    newUser.user_tutor = false;
    newUser.user_college = "Dundalk Institute of Technology";

    return new Promise((resolve, reject) => {
      newUser.save(function (err) {
        if (err) {
          console.log("Error adding new user");
          console.log(err);
          //return JSON.stringify({ error: true, response: err });
          resolve({ error: true, response: err });
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
          resolve({ error: true, response: exception });
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
              resolve({ error: true, response: newUser });
            }
          }
        }).catch((exception) => {
          resolve({ error: true, response: exception });
        });
    });
  }

  delete_user_by_email(email) {
    return new Promise((resolve, reject) => {
      userModel.findOneAndRemove({ user_email: email })
        .then((err, newUser) => {
          resolve({ error: false, response: "User deleted successfully" });
        }).catch((exception) => {
          console.log("Exception has occured");
          resolve({ error: true, response: exception });
        });
    });
  }

  delete_notifications_by_email(email) {
    const notificationModelSchema = require('../models/notifications');
    const filter = { std_email: email };

    return new Promise((resolve, reject) => {
      notificationModelSchema.deleteMany(filter)
        .then((err, newUser) => {
          resolve({ error: false, response: "Notification deleted successfully" });
        }).catch((exception) => {
          console.log("Exception has occured");
          resolve({ error: true, response: exception });
        });
    });
  }

  delete_post_by_email(email) {
    const postModelSchema = require('../models/post');
    const filter = { std_email: email };

    return new Promise((resolve, reject) => {
      postModelSchema.deleteMany(filter)
        .then((err, newUser) => {
          resolve({ error: false, response: "Notification deleted successfully" });
        }).catch((exception) => {
          console.log("Exception has occured");
          resolve({ error: true, response: exception });
        });
    });
  }

  delete_notifications_by_modules(all_user_modules) {
    const notificationModelSchema = require('../models/notifications');
    const filter = { notification_modules: { "$all": all_user_modules } };;

    return new Promise((resolve, reject) => {
      notificationModelSchema.deleteMany(filter)
        .then((err, newUser) => {
          resolve({ error: false, response: "Notification deleted successfully" });
        }).catch((exception) => {
          console.log("Exception has occured");
          resolve({ error: true, response: exception });
        });
    });
  }

  ///////
  elevate_user_to_tutor(email, modules) {
    const filter = { user_email: email };
    const update = { user_tutor: true, user_modules: modules };

    return new Promise((resolve, reject) => {
      userModel.findOneAndUpdate(filter, update).then(result => {
        resolve({error: false, response: "User elevated successfully!"});
      })
        .catch((exception) => {
          resolve({ error: true, response: exception });
        });
    });
  }

  add_tutorial(request_title, request_description, request_modules, users_email) {
    const contenxt = this;
    const postModel = require('../models/post');
    let newPost = new postModel();

    //Create New Users from Schema 'User.js' in models folder
    newPost.std_email = users_email;
    newPost.post_title = request_title;
    newPost.post_desc = request_description;
    newPost.post_status = "Open";
    newPost.post_modules = request_modules;

    return new Promise((resolve, reject) => {
      newPost.save(async function (err, post) {
        if (err) {
          resolve({ error: true, response: err });
        } else {
          let notification_response = await contenxt.create_notification("Tutorial request sent", "You have successfully requested a tutorial for the following modules: " + request_modules.join(', ') + ". A tutor will be in contact with you as soon as possible.", post.std_email, ["Tutorial request sent"], { post_id: post._id, modules: request_modules });

          if (!notification_response.error) {
            let tutor_notification_response = await contenxt.create_notification_for_tutors("New tutorial request", post.std_email, post.std_email + " requested a tutorial for the " + request_modules.join(', ') + " modules. Please see the post in context.", ["Tutorial requested"], request_modules, post._id)

            if (!tutor_notification_response.error) {
              resolve({ error: false, debug_message: "Post created successfully.", response: [post, notification_response.response, tutor_notification_response.response] });
            } else {
              resolve({ error: true, response: notification_response.response });
            }
          } else {
            resolve({ error: true, response: notification_response.response });
          }
        }
      });
    });
  }

  create_notification_for_tutors(notification_title, sender_email, notification_description, notification_tags, notification_modules, post_id) {
    const notificationModelSchema = require('../models/notifications');
    const dateformat = require('dateformat');

    let notificationModel = new notificationModelSchema();
    let notification_posted_on = dateformat(new Date(), 'mmmm dS');

    notificationModel.notification_avatar = "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png";
    notificationModel.notification_title = notification_title;
    notificationModel.notification_desc = notification_description;
    notificationModel.notification_desc_trunc = notification_description.trunc(100);
    notificationModel.notification_posted_on = notification_posted_on;
    notificationModel.notification_tags = notification_tags;
    notificationModel.notification_modules = notification_modules;
    notificationModel.post_id = post_id;
    notificationModel.std_email = sender_email;

    return new Promise((resolve, reject) => {
      notificationModel.save(function (err, notification) {
        if (err) {
          resolve({ error: true, response: err });
        } else {
          resolve({ error: false, response: notification });
        }
      });
    });
  }

  create_notification(notification_title, notification_description, users_email = "", notification_tags, extra_information = null) {
    const notificationModelSchema = require('../models/notifications');
    let notificationModel = new notificationModelSchema();

    const dateformat = require('dateformat');
    let notification_posted_on = dateformat(new Date(), 'mmmm dS');

    if (extra_information !== null) {
      if (notification_tags.includes("Tutorial request sent")) {
        notificationModel.post_id = extra_information.post_id;

        notificationModel.notification_modules = extra_information.modules;
      }
    }

    //Create New Users from Schema 'User.js' in models folder
    if (users_email !== "") {
      notificationModel.std_email = users_email;
    }

    notificationModel.notification_desc = notification_description;
    notificationModel.notification_desc_trunc = notification_description.trunc(100);
    notificationModel.notification_avatar = "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png";
    notificationModel.notification_title = notification_title;

    notificationModel.notification_posted_on = notification_posted_on;
    notificationModel.notification_tags = notification_tags;

    return new Promise((resolve, reject) => {
      notificationModel.save(function (err, notification) {
        if (err) {
          resolve({ error: true, response: err });
        } else {
          resolve({ error: false, response: notification });
        }
      });
    });
  }

  get_tutor_notifications(notificationModelSchema, tutor_notfications_filter) { 
    return new Promise((resolve, reject) => { 
      notificationModelSchema.find(tutor_notfications_filter).then((notifications) => {
        if (!notifications.length) {
          resolve({ error: false, response: "There are no notifications to display!" });
        } else {
          resolve({ error: false, response: notifications });
        }

      })
        .catch((exception) => {
          console.log("aLL TUTOR error")
          console.log(exception);
          resolve({ error: true, response: exception });
        });
    });
  }

  async get_all_users_notifications(email, user_tutor) {
    const notificationModelSchema = require('../models/notifications');

    if (user_tutor.is_tutor) {
      let all_user_modules = user_tutor.user_modules;
      console.log(all_user_modules);
      const tutor_notfications_filter = { notification_modules: { "$all": all_user_modules }, std_email: {"$ne": email}, notification_tags: {"$in": ["Tutorial requested"]} };

      let tutor_notifications = await this.get_tutor_notifications(notificationModelSchema, tutor_notfications_filter);

      if (!tutor_notifications.error) {
        const filter = { std_email: email,  notification_tags: {"$nin": ["Tutorial requested"]}};

        return new Promise((resolve, reject) => {
          notificationModelSchema.find(filter).then((notifications) => {
            if (!notifications.length && tutor_notifications.response === "There are no notifications to display!") {
              console.log("end")
              resolve({ error: true, response: "There are no notifications to display!" });
            } else {
              if (tutor_notifications.response !== "There are no notifications to display!") {
                for (let i = 0; i < tutor_notifications.response.length; i++) {
                  notifications.push(tutor_notifications.response[i]);
                }
              } 
              console.log(tutor_notifications);

              resolve({ error: false, response: notifications });
            }

          })
            .catch((exception) => {
              console.log("error")
              resolve({ error: true, response: exception });
            });
        });
      } else {
        console.log("Unique")
        return tutor_notifications.response;
      }
    } else {
      const filter = { std_email: email, notification_tags: {"$nin": ["Tutorial requested"]} };

      return new Promise((resolve, reject) => {
        notificationModelSchema.find(filter).then((notifications) => {
          console.log(notifications);

          if(notifications.length !== 0) {
            resolve({ error: false, response: notifications });
          }  else {
            resolve({ error: false, response: 'There are no notifications to display!' });
          }
        })
          .catch((exception) => {
            console.log("error")
            resolve({ error: true, response: exception });
          });
      });
    }
  }

  get_all_elegible_posts(modules) {
    const postModel = require('../models/post');
    const filter = { post_modules: { "$all": modules } };

    return new Promise((resolve, reject) => {
      postModel.find(filter).then((posts) => {
        if (!posts.length) {
          resolve({ error: false, response: "There are no posts to display!" });
        } else {
          resolve({ error: false, response: posts });
        }

      })
        .catch((exception) => {
          console.log("error")
          resolve({ error: true, response: exception });
        });
    });
  }

  set_notification_to_read(notification_id) {
    const notificationModelSchema = require('../models/notifications');

    const filter = { _id: notification_id };
    const update = { notification_opened: true };

    return new Promise((resolve, reject) => {
      notificationModelSchema.findOneAndUpdate(filter, update).then(result => {
        resolve("Notification updated successfully!");
      })
        .catch((exception) => {
          resolve({ error: true, response: exception });
        });
    });
  }

}

//mongoose.Promise = global.Promise;
//mongodb+srv://Tutum_Nichita:EajHKuViBCaL62Sj@tutum-qips2.azure.mongodb.net/service_loop?retryWrites=true&w=majority

module.exports = database;

