const express = require('express');
const cors = require('cors');
const Live_Updates = require('./services/Live_Updates');
const app = express();

var Live_Updates_Controller; 

//const xssFilters = require('xss-filters');

app.use(cors());
app.use(express.json());

function back_to_main_thread(res, pdf_path) {
  res.json(pdf_path);
}


//MOVE TO functions.js
function arrayContainsSameValues(arr, arr2) {
  return arr.every(i => arr2.includes(i));
}

/*
  Add a new function called "remove" to the Array prototype
  that removes a value from an array without needing to loop
  each time.
*/
Array.prototype.remove = function () {
  var what, a = arguments, L = a.length, ax;
  while (L && this.length) {
    what = a[--L];
    while ((ax = this.indexOf(what)) !== -1) {
      this.splice(ax, 1);
    }
  }
  return this;
};

app.post('/create_and_sign_pdf', async (req, res) => {
  const Digital_Signature = require('./services/Digital_Signature');
  const signature_pdf = new Digital_Signature();

  try {
    // let pdf_path = await signature_pdf.create_digitally_signed_pdf("John_Doe_and_Jane_Doe_contract",
    //   "John Doe (\"Lender\") is lending 100 euro (the \"principal\") to hhdhdhd(\"Borrower\").The yearly interest rate of this loan is 0%. This is simple interest, with partialyears prorated on the basis of a 365-day year. If this rate exceeds the legal limit,then the interest rate shall equal the legal limit, and all related figures in thisagreement shall be adjusted accordingly.The loan begins on 2018-12-12.The following term applies:Lump-sum payment: Borrower must pay Lender the principal plus anyaccumulated interest in a lump sum on or before 2018-12-12.If Borrower fails to make any payment on time, the loan will be in default. Upondefault, the total outstanding balance will accrue interest at the annualized rateplus 10 percentage points over the annualized rate, or the legal limit if lower, untilit is paid.If any overdue amount is not paid within 30 days, Lender will have the option todemand from Borrower, for immediate payment, the total outstanding loanbalance (principal plus any accrued interest).This agreement is between Borrower and Lender, and neither is allowed todelegate, transfer or assign it to a third party without the written consent of theother.This is the parties' entire agreement on this matter, superseding all previousnegotiations or agreements. It can only be changed by mutual written consent.Failure to enforce any provision within this agreement does not waive thatprovision.The laws of the state of Louth govern this agreement and any disputes arising fromit will be handled exclusively in courts in that state. The prevailing party in anydispute will be entitled to recover reasonable costs and attorneys' fees.If a court invalidates any part of this agreement, the rest remains in effect.Signing a copy of this agreement, physical or electronic, will have the same effectas signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.signing an original.",
    //   "s", "d");

    //let verified_results = await signature_pdf.verify_all_digital_signatures("tt");

    //back_to_main_thread(res, pdf_path);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
});

app.post('/check_user_details_correct', async (req, res) => {
  const login = require('./services/login');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await login.check_user_credentials(req.body.users_email, req.body.users_password, database_connection));
  return;
});

app.post('/verify_code', async (req, res) => {
  const validator = require('validator');

  const token = req.body.verification_token;
  const code = req.body.verification_code;
  const verification_phone_number = validator.escape(req.body.verification_phone_number).replace(/\s/g, '');

  var ringcaptcha = require('ringcaptcha-nodejs');
  ringcaptcha.app_key = '3i1ivu6elylunazito7y';//Add Your App Key
  ringcaptcha.api_key = '112a600ad7ce7b679505469dd5079444cbdc1344'; //Add Your API Key
  ringcaptcha.secret_key = '3i5u7ezara9o5yhy6u8a'; //Add Your Secret Key

  data = { mobile: verification_phone_number, country_code: '+353', token: token, code: code }
  ringcaptcha.verifyingPin(data, function (response) {
    res.json(response);
    console.log(response);
    return;
  });

  //res.json(await login.check_user_credentials(req.body.users_email, req.body.users_password));
  return;
});


app.post('/verify_register_input', async (req, res) => {
  const validator = require('validator');
  const database = require('./services/database');
  const filter_registration_input = require('./services/registration/filter_registration_input');
  //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)
  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  let filtering_response = await filter_registration_input.validate_registration_input(validator.escape(req.body.users_full_name), req.body.users_password, req.body.users_password_confirm, validator.escape(req.body.users_email), validator.escape(req.body.users_phone_number), database_connection);

  res.json(JSON.stringify(filtering_response));
  return;
});


app.post('/resend_sms_verification', async (req, res) => {
  const validator = require('validator');
  const verification_phone_number = validator.escape(req.body.verification_phone_number).replace(/\s/g, '');

  var ringcaptcha = require('ringcaptcha-nodejs');
  ringcaptcha.app_key = '3i1ivu6elylunazito7y';//Add Your App Key
  ringcaptcha.api_key = '112a600ad7ce7b679505469dd5079444cbdc1344'; //Add Your API Key
  ringcaptcha.secret_key = '3i5u7ezara9o5yhy6u8a'; //Add Your Secret Key

  data = { mobile: verification_phone_number, country_code: '+353', service: 'SMS' }
  ringcaptcha.reSendPINCode(data, function (response) {
    res.json(response);
  });

  return;
});

app.post('/send_sms_verification', async (req, res) => {
  const validator = require('validator');
  const verification_phone_number = validator.escape(req.body.verification_phone_number).replace(/\s/g, '');

  var ringcaptcha = require('ringcaptcha-nodejs');
  ringcaptcha.app_key = '3i1ivu6elylunazito7y';//Add Your App Key
  ringcaptcha.api_key = '112a600ad7ce7b679505469dd5079444cbdc1344'; //Add Your API Key
  ringcaptcha.secret_key = '3i5u7ezara9o5yhy6u8a'; //Add Your Secret Key

  data = { mobile: verification_phone_number, country_code: '+353', service: 'SMS' }
  ringcaptcha.sendingPINCode(data, function (response) {
    console.log(response);
    res.json(response);
  });

  return;
});

app.post('/login_user', async (req, res) => {
  const login = require('./services/login');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await login.login_user(req.body.users_email, req.body.users_password, database_connection));
  return;
});

app.post('/verify_token', (req, res) => {
  const jwt = require('jsonwebtoken');
  let token = req.body.token;

  try {
    //process.env.JWT_SECRET
    let JWT_SECRET = 'addjsonwebtokensecretherelikeQuiscustodietipsoscustodes';
    let decoded = jwt.verify(token, JWT_SECRET);

    res.json("Session valid");
    return;
  } catch (err) {
    if (err.message === "jwt expired") {
      res.json("Session timeout");
      return;
    } else if (err.message === "jwt malformed") {
      res.json("Session corrupted");
      return;
    } else {
      res.json("Unspecified error occured");
      return;
    }
  }
});

app.post('/register', async (req, res) => {
  const register_new_user = require('./services/registration/register');
  const validator = require('validator');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  let result = await register_new_user.create_new_user(validator.escape(req.body.users_full_name), req.body.users_password, req.body.users_password_confirm, validator.escape(req.body.users_email), validator.escape(req.body.users_phone_number), database_connection);
  res.json(JSON.stringify(result));
  return;
});

//Need the forward slash...
//"java -jar /home/d00192082/ServiceLoopServer/resources/java/JSignPdf.jar /home/d00192082/ServiceLoopServer/resources/pdfs/agreement_5e428eff1700d139c09167d2.pdf -v --visible-signature -d /home/d00192082/ServiceLoopServer/resources/pdfs -a --bg-path /home/d00192082/ServiceLoopServer/resources/images/adobe_watersign.png -page 1000 -kst PKCS12 -ksf /home/d00192082/ServiceLoopServer/ssl/client_5e41bc1b78c9ad2fa0dadac7.p12 -ksp pycnaMLBLp 2>&1"
app.post('/appply_to_be_tutor', async (req, res) => {
  try {
    let database = require('./services/database')
    const validator = require('validator');

    if (req.body.users_email === "" || req.body.users_email && req.body.users_skills.length !== 0 && req.body.users_skills) {
      let tutor_email = req.body.users_email;
      let tutor_skills = req.body.users_skills;

      const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
      let db_con_response = await database_connection.connect();

      res.json(await database_connection.elevate_user_to_tutor(tutor_email, tutor_skills));
      return;
    } else {
      res.json({ error: true, response: "Please fill out all fields before applying." });
      return;
    }
  } catch (ex) {
    //????? maybe delete
    database_connection.disconnect();
    res.json(ex);
    return;
  }

});

app.post('/request_tutorial', async (req, res) => {
  let database = require('./services/database')
  const validator = require('validator');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  if (req.body.request_title.length == 0 || req.body.request_description.length == 0 || typeof req.body.request_modules[0] == "undefined" || req.body.request_modules == null || req.body.request_modules.length == null || req.body.users_email.length == 0) {
    res.json({ error: true, response: "Please fill in all fields before proceeding." });
    return;
  }

  res.json(await database_connection.add_tutorial(req.body.request_title, req.body.request_description, req.body.request_modules, req.body.users_email));
  return;
});

app.post('/get_all_notifications', async (req, res) => {
  const validator = require('validator');
  const database = require('./services/database');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  for (var key in req.body) {
    if (req.body[key] === "") {
      res.json({ error: true, response: "Please fill in all fields before proceeding." });
      return;
    }
  }

  res.json(await database_connection.get_all_users_notifications(validator.escape(req.body.users_email), req.body.user_tutor));
  return;
});

app.post('/set_notification_to_read', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.set_notification_to_read(req.body.notification_id));
  return;
});

app.post('/get_all_posts', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  //DELETE EVERYTHING
  //await database_connection.reset();

  res.json(await database_connection.get_all_elegible_posts(req.body.email, req.body.user_modules));
  return;
});

app.post('/post_accepted', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.accept_post(req.body.tutor_email, req.body.tutor_name, req.body.post_id));
  return;
});

app.post('/get_notification_posts', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.get_notification_posts(req.body.notification_posts_id));
  return;
});

//TEST THIS
app.post('/get_my_requested_posts', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.get_all_users_tutorials(req.body.users_email));
  return;
});

//TEST THIS
app.post('/get_all_tutor_tutorials', async (req, res) => {
  let database = require('./services/database')

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.get_all_tutor_tutorials(req.body.users_email));
  return;
});

//TEST THIS
app.post('/offer_agreement', async (req, res) => {
  if (req.body.tutorial_room == "" || req.body.tutorial_room == "" || req.body.tutor_signature == "") {
    res.json({ error: true, response: "Please fill in all fields before proceeding." });
  }

  const database = require('./services/database');
  const offer_agreement = require('./services/offer_agreement');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await offer_agreement.offer_agreement(database_connection, req.body.tutorial_id, req.body.tutorial_date.substring(0, 10), req.body.tutorial_time, req.body.tutorial_room, req.body.tutor_signature));
  return;
});

//TEST THIS
app.post('/accept_agreement', async (req, res) => {
  const database = require('./services/database');
  const accept_agreement = require('./services/accept_agreement');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await accept_agreement.accept_agreement(database_connection, req.body.tutorial_id, req.body.student_signature));
  return;
});

//TEST THIS
app.post('/reject_agreement', async (req, res) => {
  const database = require('./services/database');
  const accept_agreement = require('./services/accept_agreement');

  const database_connection = new database("Tutum_Nichita", "EajHKuViBCaL62Sj", "service_loop");
  let db_con_response = await database_connection.connect();

  res.json(await database_connection.reject_agreement(req.body.tutorial_id));
  return;
});

// var server = app.listen(3001, async function () {
//   console.log('App started!');

//   Live_Updates_Controller = new Live_Updates(server, app);
//   Live_Updates_Controller.connect();
// });

var server = app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, async function () {
  console.log('App started!');

  Live_Updates_Controller = new Live_Updates(server, app);
  Live_Updates_Controller.connect();
});