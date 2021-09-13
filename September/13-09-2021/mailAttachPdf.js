
"use strict";
const nodemailer = require("nodemailer");
const { getMaxListeners } = require('process');

// async..await is not allowed in global scope, must use a wrapper
async function main() {
  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let testAccount = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'test.paritalearning@gmail.com', // generated ethereal user
      pass: 'Parita@23', // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'test.paritalearning@gmail.com', // sender address
    to: 'pariganatra232@gmail.com', // list of receivers
    subject: ' Node.js email with attachment', // Subject line
    text: 'Hi,This is a test mail sent using Nodemailer', // plain text body
    html: '<h1>You can send html formatted content using Nodemailer with attachments</h1>', // html body
    attachments: [
      {
        filename: 'attachment.pdf',
        path: 'C:/Users/INTEL/Desktop/Training1/September/13-09-2021/attachment.pdf',
        contentType: 'application/pdf'
      }
    ]
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
}

main().catch(console.error);

