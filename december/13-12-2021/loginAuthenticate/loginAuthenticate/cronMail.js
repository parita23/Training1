
var cron = require("node-cron");
const nodemailer = require("nodemailer");
global.config=require('./config/config.json')


cron.schedule(config.scheduler.files.sendAllMail.time, async() => {
    console.log('sending mail every 5 seconds');

async function main() {
    let testAccount = await nodemailer.createTestAccount();
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "test.paritalearning@gmail.com", // generated ethereal user
        pass: "Parita@23", // generated ethereal password
      },
    });
  
    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: "pariganatra232@gmail.com", // sender address
      to: "test.paritalearning@gmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>",
    });
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  }
  main().catch(console.error);
    
    
});

