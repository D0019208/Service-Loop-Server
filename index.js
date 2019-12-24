const express = require('express')
const cors = require('cors')
const app = express();

app.use(cors());
app.use(express.json());

function back_to_main_thread(res, pdf_path) {
  res.json(pdf_path);
}

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
  console.log(await login.check_user_credentials(req.body.users_email, req.body.users_password));
  res.json(await login.check_user_credentials(req.body.users_email, req.body.users_password));
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
  const filter_registration_input = require('./services/registration/filter_registration_input');
  //validator.escape(req.body.users_first_name + " " + req.body.users_last_name)
  let filtering_response = await filter_registration_input.validate_registration_input(req.body.users_password, req.body.users_password_confirm, validator.escape(req.body.users_email), validator.escape(req.body.users_phone_number));

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

  res.json(await login.login_user(req.body.users_email, req.body.users_password));
  return;
});

app.post('/verify_token', (req, res) => {
  const jwt = require('jsonwebtoken');
  let token = JSON.parse(req.body.token);

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

  let result = await register_new_user.create_new_user(req.body.users_password, req.body.users_password_confirm, validator.escape(req.body.users_email), validator.escape(req.body.users_phone_number));
  res.json(JSON.stringify(result));
  return;
});

// (async () => {
//   const register_new_user = require('./services/registration/register');
//   const validator = require('validator');

//   let result = await register_new_user.create_new_user("12345aA@", "12345aA@", validator.escape("nikito888@gmail.com"), validator.escape("0899854571"));
//   console.log(result);
//   //res.json(JSON.stringify(result));
//   return;
// })();

// app.listen(3000, function () {
//   console.log('Example app started!');
// });

app.listen(process.env.ALWAYSDATA_HTTPD_PORT, process.env.ALWAYSDATA_HTTPD_IP, function () {
  console.log('Example app started!');
});