let send_email = function send_email(email_object) { 
    return;
    var nodemailer = require('nodemailer'); 

    var client = nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
            user: 'D00192082',
            pass: '3820065Np2!'
        }
    });

    let date = new Date();
    let today = date.getDay() + "-" + date.getMonth() + 1 + "-" + date.getFullYear();

    var email = {
        from: 'D00192082@student.dkit.ie',
        to: email_object.student.student_email,
        subject: email_object.tutor.tutor_email_subject,
        //text: 'Hello world',
        html: '<table style="font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px; border-bottom: solid 1px #d9d9d9;border-right: solid 1px #d9d9d9;border-left: solid 1px #d9d9d9;border-top: solid 10px #4756c6;"> <thead> <tr> <th style="text-align:left;"><a href="https://d00192082.alwaysdata.net/Lottery/index.php"><img style="max-width: 100px;" src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_logo.png" alt="Service Loop"></a></th> <th style="text-align:right;font-weight:400;">' + today + '</th> </tr></thead> <tbody> <tr> <td style="height:35px;"></td></tr><tr> <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span> ' + email_object.student.student_email + '</p></td><td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Name</span> ' + email_object.student.student_name + '</p></td></tr><tr> <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Message</td></tr><tr> <td colspan="2" style="padding:15px"> <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold"> <span style="display:block;font-size:13px;font-weight:normal"><b>Registration complete! </b><br><span style="display:block;font-size:13px;font-weight:normal">' + email_object.student.student_email_body + '</span> <br> </p></td></tr></tbody> <tfooter> <tr> <td colspan="5" style="text-align: center;"> <a href="#"><img style="max-width: 350px;" src="https://d00192082.alwaysdata.net/Booker/resources/booker_footer.png" alt="Service Loop Logo"></a> </td></tr></tfooter> </table>',
        attachments: [
            {
                filename: email_object.agreement_name,
                path: email_object.agreement_url,
                contentType: 'application/pdf'
            }]
    };

    client.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ' + info.response);
        }
    });

    email = {
        from: 'D00192082@student.dkit.ie',
        to: email_object.tutor.tutor_email,
        subject: email_object.student.student_email_subject,
        //text: 'Hello world',
        html: '<table style="font-family: Open Sans, sans-serif;font-size:100%;font-weight:400;line-height:1.4;max-width:670px;margin:50px auto 10px;background-color:#fff;padding:50px;-webkit-border-radius:3px;-moz-border-radius:3px;border-radius:3px; border-bottom: solid 1px #d9d9d9;border-right: solid 1px #d9d9d9;border-left: solid 1px #d9d9d9;border-top: solid 10px #4756c6;"> <thead> <tr> <th style="text-align:left;"><a href="https://d00192082.alwaysdata.net/Lottery/index.php"><img style="max-width: 100px;" src="https://d00192082.alwaysdata.net/ServiceLoopServer/resources/images/email_logo.png" alt="Service Loop"></a></th> <th style="text-align:right;font-weight:400;">' + today + '</th> </tr></thead> <tbody> <tr> <td style="height:35px;"></td></tr><tr> <td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Email</span> ' + email_object.tutor.tutor_email + '</p></td><td style="width:50%;padding:20px;vertical-align:top"> <p style="margin:0 0 10px 0;padding:0;font-size:14px;"><span style="display:block;font-weight:bold;font-size:13px;">Name</span> ' + email_object.tutor.tutor_name + '</p></td></tr><tr> <td colspan="2" style="font-size:20px;padding:30px 15px 0 15px;">Message</td></tr><tr> <td colspan="2" style="padding:15px"> <p style="font-size:14px;margin:0;padding:10px;border:solid 1px #ddd;font-weight:bold"> <span style="display:block;font-size:13px;font-weight:normal"><b>Registration complete! </b><br><span style="display:block;font-size:13px;font-weight:normal">' + email_object.tutor.tutor_email_body + '</span> <br> </p></td></tr></tbody> <tfooter> <tr> <td colspan="5" style="text-align: center;"> <a href="#"><img style="max-width: 350px;" src="https://d00192082.alwaysdata.net/Booker/resources/booker_footer.png" alt="Service Loop Logo"></a> </td></tr></tfooter> </table>',
        attachments: [
            {
                filename: email_object.agreement_name,
                path: email_object.agreement_url,
                contentType: 'application/pdf'
            }]
    };  

    client.sendMail(email, function (err, info) {
        if (err) {
            console.log(err);
        }
        else {
            console.log('Message sent: ' + info.response);
        }
    });
 
}

exports.send_email = send_email;