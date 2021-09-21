var express = require('express');
var router = express.Router();

// nodemailer
var nodemailer = require('nodemailer');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/signupForEmail', function(req, res, next) {
  res.render('signupForEmail', { title: 'signupForEmail' });
});

router.post('/send', function(req, res, next) {
  console.log(req.body);
  const output = `
  <p>You have new contact request</p>
  <h3>Inquiry Contact Details</h3>
  <table style=" font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 80%;">
  <tr>
  <th style="padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: lightblue;
  color: black;">Name</th>
  <th  style="padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: lightblue;
  color: black;">Email</th>
  <th  style="padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: lightblue;
  color: red;">Password</th>
  <th  style="padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: lightblue;
  color: black;">Mobile</th>
  <th  style="padding-top: 12px;
  padding-bottom: 12px;
  text-align: left;
  background-color: lightblue;
  color: black;">Gender</th>
  </tr>
  <tr>
  <td>${req.body.name}</td>
  <td>${req.body.email}</td>
  <td style="color: red;">${req.body.password}</td>
  <td>${req.body.mobile}</td>
  <td>${req.body.gender}</td>
  </tr>
  </table>
  `;

  // nodemailer
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'test.paritalearning@gmail.com', // generated ethereal user
        pass: 'Parita@23', // generated ethereal password
      }
  });
  const mailOptions = {
    from: 'test.paritalearning@gmail.com', // sender address
    to: 'pariganatra232@gmail.com', // list of receivers
      subject: "Contact Details", // Subject line
      text: "Hello Parita", // plain text body
      html: output, // html body
  };
  transporter.sendMail(mailOptions, function(err, info) {
      if (err)
          console.log(err)
      else
          console.log(info);
      console.log("MAIL SENT");
  });
  res.render('signupForEmail', { msg: 'Email has been sent succefully.' })
});

router.get('/customEmail', function(req, res, next) {
  res.render('customEmail', { title: 'customEmail' });
});

router.post('/customSend', function(req, res, next) {
  console.log(req.body);
  const output = `
<p>You have new Mail</p>
<h3>Tesing custom Email</h3>
<ul>
<li>Subject : ${req.body.subject}</li>
<li>Body : ${req.body.body}</li>
</ul>
<h2>Thank You</h2>
`;

  // nodemailer
  var nodemailer = require('nodemailer');
  var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'test.paritalearning@gmail.com', // generated ethereal user
        pass: 'Parita@23', // generated ethereal password
      }
  });
  const mailOptions = {
      from: 'test.paritalearning@gmail.com', // sender address
      to: `${req.body.email}`, // list of receivers
      subject: `${req.body.subject}`, // Subject line
      html: `${req.body.body}`, // plain text body
      // html: output, // html body
  };
  transporter.sendMail(mailOptions, function(err, info) {
      if (err)
          console.log(err)
      else
          console.log(info);
      console.log("MAIL SENT");
  });
  res.render('customEmail', {
      msg: 'Email has been sent succefully to ' + req.body.email
  })
});
module.exports = router;
