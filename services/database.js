const mongoose = require('mongoose');
const userModel = require('../models/users');

class database {
  constructor(user, key, database) {
    this.user = user;
    this.key = key;
    this.database = database;
  }

  //Establish the connection to the MongoDB
  connect() {
    return new Promise((resolve, reject) => {

      /*
      Add a new function called "trunc" to the String prototype
      that truncates a 
      */
      String.prototype.trunc =
        function (n, useWordBoundary) {
          if (this.length <= n) { return this; }
          var subString = this.substr(0, n - 1);
          return (useWordBoundary
            ? subString.substr(0, subString.lastIndexOf(' '))
            : subString) + "&hellip;";
        };

      console.log("Connecting to database");

      //Callback that executes when MongoDB connection has been established
      mongoose.connection.on("connected", () => {
        resolve({ error: false, response: "Database has connected successfully." });
      });

      //Callback that executes when an error occurs during database connection
      mongoose.connection.on("error", (error) => {
        reject({ error: true, response: error });
      });

      //Fuction to connect to the database itself, it takes the details needed for a connection from the Database class
      mongoose.connect('mongodb+srv://' + this.user + ':' + this.key + '@tutum-qips2.azure.mongodb.net/' + this.database + '?retryWrites=true&w=majority', {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
      });
    });
  }

  //Function to close the mongoDB connection (80 active connections causes an error)
  disconnect() {
    mongoose.connection.close();
  }

  /**
   * A function that registers a new user into the MongoDB along with creating a digital certificate for the new user
   * 
   * @param {String} users_full_name - The full name of the user to be registered e.g. "John Wick"
   * @param {String} users_email - This is the users email, it must be a valid email address such as "D12345678@student.dkit.ie"
   * @param {String} users_phone_number - This is the users phone number, it must be a valid Irish phone number, e.g. "08645719123" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
  register_new_user(users_full_name, users_email, users_phone_number) {
    //Create an instance of the model
    let newUser = new userModel();

    //Create the new user by assigning the function variables to the model instance
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

  /**
   * A function that updates the existing users details by adding the hashed password, the jsut created digital certificate path and the
   * digital certificate password.
   * 
   * @param {String} doc_filter - This is the filter by which we will find the user to update e.g. "D12345678@student.dkit.ie"
   * @param {String} password - This is the hashed password of the user
   * @param {String} digital_certificate_path - This is the users digital certificate path e.g. "ss/client_5e00eff87738617a61b9dedc.p12"
   * @param {String} digital_certificate_password - This is the users digital certificate, it is unique and randomly generated, e.g. "asgDFG3H2@S1!" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
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

  /**
   * A function that finds and returns a user by email
   * 
   * @param {String} email - This is the filter by which we will find the user, e.g. "D12345678@student.dkit.ie" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
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

  /**
   * A function that finds and deletes a user by email
   * 
   * @param {String} email - This is the filter by which we will find the user, e.g. "D12345678@student.dkit.ie" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
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

  /**
   * A function that deletes all notifications from a specific email, we use this in our Spec files to test
   * 
   * @param {String} email - This is the filter by which we will find the user, e.g. "D12345678@student.dkit.ie" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
  delete_posts_by_email(email) {
    const postsModelSchema = require('../models/post');
    const filter = { std_email: email };

    return new Promise((resolve, reject) => {
      postsModelSchema.deleteMany(filter)
        .then((err, post) => {
          resolve({ error: false, response: "Posts deleted successfully" });
        }).catch((exception) => {
          console.log("Exception has occured");
          resolve({ error: true, response: exception });
        });
    });
  }  

  /**
   * A function that deletes all notifications from a specific email, we use this in our Spec files to test
   * 
   * @param {String} email - This is the filter by which we will find the user, e.g. "D12345678@student.dkit.ie" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
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

  /**
   * A function that deletes all posts from a specific email, we use this in our Spec files to test
   * 
   * @param {String} email - This is the filter by which we will find the user, e.g. "D12345678@student.dkit.ie" 
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
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

  /**
   * A function that deletes all notifications by checking for specific modules, e.g. ["JavaScript", "PHP"], we use this in our Spec files to test
   * 
   * @param {Array} all_user_modules - This is the filter by which we will find the user, e.g. ["JavaScript", "PHP"]
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
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

  /**
   * A function that elevates a "Student" user to a "Tutor" user
   * 
   * @param {String} email - This is the filter by which we will find the user, e.g. "D12345678@student.dkit.ie"
   * @param {Array} all_user_modules - These are the modules that the applicant is offering, e.g. ["JavaScript", "PHP"]
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be a String that contains the response from the function
   */
  elevate_user_to_tutor(email, modules) {
    const filter = { user_email: email };
    const update = { user_tutor: true, user_modules: modules };

    return new Promise((resolve, reject) => {
      userModel.findOneAndUpdate(filter, update).then(result => {
        resolve({ error: false, response: "User elevated successfully!" });
      })
        .catch((exception) => {
          resolve({ error: true, response: exception });
        });
    });
  }

  /**
   * A function that adds a tutorial to the database after which we also add a new notification if tutorial was added
   * successfully.
   * 
   * @param {String} request_title - This is the title of the request, e.g. "JS and php tutorial request"
   * @param {String} request_description - This is a more in depth description of the Students request, e.g. "Need help for 2nd year project with bridging PHP with JS AJAX"
   * @param {Array} request_modules - These are the modules that the Student needs help with, e.g. ["JavaScript", "PHP"]
   * @param {String} users_email - This is the email of the student who needs help e.g. "D12345678@student.dkit.ie"
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will be an array that contains the post added and the response for
   * the normal notification added and the tutor notification added 
   */
  async add_tutorial(request_title, request_description, request_modules, users_email) {
    const contenxt = this;
    const postModel = require('../models/post');
    let newPost = new postModel();
    const dateformat = require('dateformat');

    //Create New Users from Schema 'User.js' in models folder
    let users_name = await this.getNameByEmail(users_email);

    newPost.std_name = users_name.users_full_name;
    newPost.std_email = users_email;
    newPost.std_avatar = "https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/base_user.png";
    newPost.post_title = request_title;
    newPost.post_posted_on = dateformat(new Date(), 'mmmm dS');
    newPost.post_desc = request_description;
    newPost.post_desc_trunc = request_description.trunc(100);

    newPost.post_status = "Open";
    newPost.post_modules = request_modules;

    return new Promise((resolve, reject) => {
      newPost.save(async function (err, post) {
        //If an error has occured, we do not create a notification but return an Object with the "error" key set to true and the error message in the "response" key
        if (err) {
          resolve({ error: true, response: err });
        } else {
          //If there is no error, we create a notification for the user stating that their request has been sent
          let notification_response = await contenxt.create_notification("Tutorial request sent", "You have successfully requested a tutorial for the following modules: " + request_modules.join(', ') + ". A tutor will be in contact with you as soon as possible.", post.std_email, ["Tutorial request sent"], { post_id: post._id, modules: request_modules });

          //If the tutorial request notification succeeds, we create a notification for all tutors that can help with the requested modules 
          if (!notification_response.error) {
            let tutor_notification_response = await contenxt.create_notification_for_tutors("New tutorial request", post.std_email, post.std_email + " requested a tutorial for the " + request_modules.join(', ') + " modules. Please see the post in context.", ["Tutorial requested"], request_modules, post._id)

            //If the notification is sent, we return an object with the "error" key set to false along with a response
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

  getNameByEmail(email) {
    const userModelSchema = require('../models/users');
    const filter = { user_email: email };

    return new Promise((resolve, reject) => {
      userModelSchema.findOne(filter).then(result => {
        console.log(result);
        resolve(result);
      })
        .catch((exception) => {
          resolve({ error: true, response: exception });
        });
    });
  }

  /**
   * A function that create a notification for all tutors who can teach the requested modules
   * 
   * @param {String} notification_title - This is the title of the notification to be sent, e.g. "New tutorial request"
   * @param {String} sender_email - This is the email of the student who sent the notification e.g. "D12345678@student.dkit.ie"
   * @param {String} notification_description - This is a more in depth description of the request, it is meant to alert the tutor that a new tutorial has been requested
   * that the Tutor can assist with, e.g. "D12345678@student.dkit.ie requested a tutorial for the JavaScript, PHP modules. Please see the post in context."
   * @param {Array} notification_tags - These are the tags of the notification, this is used to diferentiate between the different notification types, e.g. ["Tutorial requested"]
   * @param {Array} notification_modules - These are the modules that the Student needs help with, e.g. ["JavaScript", "PHP"]
   * @param {String} post_id - This is the ID of the tutorial object that the notification refers to, e.g. "5e08d59dcc2561c0d2a4ecc7"
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will contain the notification or a String if there is an error
   */
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

  /**
   * A function that create a notification, the notification can be of any type; a reminder of a new tutorial requested, a confirmation of a tutorial request sent etc.
   * 
   * @param {String} notification_title - This is the title of the notification to be sent, e.g. "Tutorial request sent"
   * @param {String} notification_description - This is a more in depth description of the notification,
   * e.g. "You have successfully requested a tutorial for the following modules: " + request_modules.join(', ') + ". A tutor will be in contact with you as soon as possible."
   * @param {String} users_email - This is an optional parameter we pass in when we want to associate a notification with a user e.g. "D12345678@student.dkit.ie"
   * @param {Array} notification_tags - These are the tags of the notification, this is used to diferentiate between the different notification types, e.g. ["Tutorial requestet sent"]
   * @param {Object} extra_information - This is an optional Object that can contain information such as a post id and modules
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will contain the notification or a String if there is an error
   */
  create_notification(notification_title, notification_description, users_email = "", notification_tags, extra_information = null) {
    const notificationModelSchema = require('../models/notifications');
    let notificationModel = new notificationModelSchema();

    //Get todays date in the following format "January 9th 20"
    const dateformat = require('dateformat');
    //yyyy
    let notification_posted_on = dateformat(new Date(), 'mmmm dS');

    //We check if there is any extra information
    if (extra_information !== null) {
      //If the tags array contains the tag "Tutorial request sent, we add a post id to the notification model"
      if (notification_tags.includes("Tutorial request sent")) {
        notificationModel.post_id = extra_information.post_id;

        if (typeof extra_information.modules !== 'undefined') {
          notificationModel.notification_modules = extra_information.modules;
        }
      }
    }

    //If there is an email, we add it to the model
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

  /**
   * A function that gets all notifications ment for a tutor from the database
   * 
   * @param {NotificationSchema} notificationModelSchema - This is the schema that we are querying
   * @param {Object} tutor_notfications_filter - This is the filter used to find the tutors notifications,
   * e.g. { notification_modules: { "$all": all_user_modules }, std_email: { "$ne": email }, notification_tags: { "$in": ["Tutorial requested"] } }
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will contain the notifications or a String if there are no notifications to display
   */
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

  /**
   * A function that gets all the users notifications, if the user is also a tutor, we get all notifications ment for a tutor
   * 
   * @param {String} email - This is the email that we will be using to query 
   * @param {Boolean} user_tutor - This is a boolean variable that states if the user is a tutor or not e.g. true means the user is a tutor, false means he is not
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will contain the notifications or a String if there are no notifications to display
   */
  async get_all_users_notifications(email, user_tutor) {
    const notificationModelSchema = require('../models/notifications');

    //If the user is a tutor, on top of getting the normal notifications, we get the tutor notifications
    if (user_tutor.is_tutor) {
      //We get the tutors modules that we then add along with the tutors emails that we will use as a filter
      let all_user_modules = user_tutor.user_modules;
      const tutor_notfications_filter = { std_email: { "$ne": email }, notification_modules: { "$in": all_user_modules }, notification_tags: { "$in": ["Tutorial requested"] } };

      //We get the tutor notifications here
      let tutor_notifications = await this.get_tutor_notifications(notificationModelSchema, tutor_notfications_filter);

      //If the tutor notifications object does not contain an error, we proceed to get the normal notifications
      if (!tutor_notifications.error) {
        const filter = { std_email: email, notification_tags: { "$nin": ["Tutorial requested"] } };

        return new Promise((resolve, reject) => {
          //Here we find the normal notifications
          notificationModelSchema.find(filter).then((notifications) => {
            //If there are no tutor or normal notifications to display, we send back a string
            if (!notifications.length && tutor_notifications.response === "There are no notifications to display!") {
              resolve({ error: true, response: "There are no notifications to display!" });
            } else {
              //If there are either normal or tutor notifications, we add the tutor notifications to the normal notifications and send them to the user
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
              resolve({ error: true, response: exception });
            });
        });
      } else {
        return tutor_notifications.response;
      }
    } else {
      //If the user is not a tutor, we just get the normal notifications
      const filter = { std_email: email, notification_tags: { "$nin": ["Tutorial requested"] } };

      return new Promise((resolve, reject) => {
        notificationModelSchema.find(filter).then((notifications) => {

          if (notifications.length !== 0) {
            resolve({ error: false, response: notifications });
          } else {
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

  /**
   * A function that gets all the posts that a tutor is elegible for
   * 
   * @param {Array} modules - This is an array that contains the tutors modules, we will filter all notifications he is elegible for based on this array
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will contain all the tutorials a tutor is elegible to teach
   */
  get_all_elegible_posts(email, modules) {
    const postModel = require('../models/post');
    const filter = { std_email: { "$ne": email }, post_modules: { "$in": modules }, post_status: { "$in": "Open" } };

    return new Promise((resolve, reject) => {
      postModel.find(filter).then((posts) => {
        if (!posts || posts.length == 0) {
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

  /**
   * A function that sets a notification to "Read"
   * 
   * @param {VARIABLE TYPE} VARIABLE_NAME - Variable description, e.g. Example
   * 
   * @returns {Return_Type} Explain what the function returns
   */

  /**
   * A function that sets a notification to "Read"
   * 
   * @param {String} notification_id - This is the ID of the notification whos status we will be updating, e.g. "5e08d59dcc2561c0d2a4ecc7"
   * 
   * @returns {Promise} This Promise will contain an object that contains 2 keys: error and response, the "error" key will be a boolean 
   * that specifies wether the registration was successful or not and the "response" key will contain a message
   */
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
  //TO BE CONTINUED
  async accept_post(tutor_email, post_id) {
    const postModel = require('../models/post');
    const filter = { _id: post_id };
    const update = { post_tut_assigned: tutor_email, post_status: "In negotiation" };

    let post_status = await this.get_post_status(post_id);

    if (!post_status.error) {
      let notification_response = await this.create_notification("Tutorial request accepted", "You have successfully accepted a tutorial. Please fill out the agreement form by clicking the below button or locating this tutorial in 'My tutorials'", tutor_email, ["Tutorial request accepted"], { post_id: post_id });

      console.log(post_id);
      if (!notification_response.error) {
        return new Promise((resolve, reject) => {
          postModel.findOneAndUpdate(filter, update).then(result => {
            console.log("Works")
            console.log(result);
            resolve({error: false, response: notification_response.response});
          })
            .catch((exception) => {
              resolve({ error: true, response: exception });
            });
        });
      } else {
        return {error: true, response: "Error creating a notification."};
      }
    } else {
      return {error: true, response: "The post you wish to tutor is no longer available!"};
    }
  }

  get_post_status(post_id) {
    const postModel = require('../models/post');

    return new Promise((resolve, reject) => {
      postModel.findOne({ _id: post_id }).then((post) => {
        if (!post) {
          resolve({ error: true, response: "Post no longer exists" });
        } else {
          resolve({ error: false, response: post.post_status });
        }
      })
        .catch((exception) => {
          console.log("error")
          resolve({ error: true, response: exception });
        });
    });
  }
}



//mongoose.Promise = global.Promise;
//mongodb+srv://Tutum_Nichita:EajHKuViBCaL62Sj@tutum-qips2.azure.mongodb.net/service_loop?retryWrites=true&w=majority

module.exports = database;

