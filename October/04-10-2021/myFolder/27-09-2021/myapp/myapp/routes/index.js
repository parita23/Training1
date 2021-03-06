var express = require('express');
var router = express.Router();

//Call User Database Model
var UsersModel = require('../schema/user_table');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


//Signup Page Display

router.get('/signup', function (req, res, next) {
  res.render('signup');
});


//Signup Page Processing
router.post('/signup', function (req, res, next) {
  UsersModel.find({ "user_email": req.body.user_email }, function (err, user_array) {
    if (err){ 
      console.log(err)
      throw err
    }
    if (user_array.length >= 1) {
      res.send(" User already exist.")
    } else {


      //Create an Array 
      const mybodydata = {
        user_name: req.body.user_name,
        user_gender: req.body.user_gender,
        user_dob: req.body.user_dob,
        user_mobile: req.body.user_mobile,
        user_email: req.body.user_email,
        user_password: req.body.user_password,
        user_isadmin: req.body.user_isadmin

      }
      var data = UsersModel(mybodydata);
      console.log(data)
      data.save(function (err) {
        if (err) {
          console.log("Error in Insert Record" + err);
        } else {
          res.render('signup');
        }
      })


    }
  })
  });







  //Login Get Method
  router.get('/login', function (req, res, next) {
    res.render('login');
  });


  //Login Process  Method
  router.post('/login', function (req, res, next) {

    var email = req.body.user_email;
    var password = req.body.user_password;

    console.log(req.body);
    UsersModel.findOne({ "user_email": email }, function (err, db_users_array) {

      console.log("Find One " + db_users_array);

      if (db_users_array) {
        var db_email = db_users_array.user_email;
        var db_password = db_users_array.user_password;

      }

      console.log("db_users_array.user_email " + db_email);
      console.log("db_users_array.user_password " + db_password);

      if (db_email == null) {
        res.end("Email not Found");
      }
      else if (db_email == email && db_password == password) {
        req.session.email = db_email;
        res.redirect('/home');
      }
      else {
        console.log("Credentials wrong");
        res.end("Login invalid");
      }


    });
  });


  //Home Page 
  router.get('/home', function (req, res, next) {

    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    console.log(myemail);

    //Auth
    if (!req.session.email) {
      console.log("Email Session is Set");
      res.end("Login required to Access this page");
    }
    res.render('home', { myemail: myemail });
  });


  //Change Paassword Page Route
  router.get('/change-password', function (req, res, next) {

    if (!req.session.email) {
      console.log("Email Session is Set");
      res.redirect('/login');
    }

    res.render('change-password');
  });

  //Change Password Process Page
  router.post('/change-password', function (req, res, next) {
    if (!req.session.email) {
      console.log("Email Session is Set");
      res.redirect('/login');
    }
    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    var opass = req.body.opass;
    var npass = req.body.npass;
    var cpass = req.body.cpass;

    UsersModel.findOne({ "user_email": myemail }, function (err, db_users_array) {

      if (err) {
        console.log("Error in Old Password Fetch " + err);
      } else {
        console.log(db_users_array);


        if (opass == db_users_array.user_password) {

          if (opass == npass) {
            res.end("New Password Must be Different then Old password");
          } else {

            if (npass == cpass) {

              UsersModel.findOneAndUpdate({ "user_email": myemail }, { $set: { "user_password": npass } }, function (err) {

                if (err) {
                  res.end("Error in Update" + err);
                } else {

                  res.send("Password Changed");
                }

              });



            } else {
              res.end("New Password and Confirm Password not match");
            }

          }

        } else {
          res.end("Old Password Not Match");
        }


      }


    });



  });



  //Logout Page
  router.get('/logout', function (req, res) {

    req.session.destroy();
    res.redirect("/");
  });



  //Forgot Password Get Method
  router.get('/forgot-password', function (req, res, next) {
    res.render('forgot-password');
  });


  //Login Process  Method
  router.post('/forgot-password', function (req, res, next) {

    var email = req.body.user_email;

    console.log(req.body);
    UsersModel.findOne({ "user_email": email }, function (err, db_users_array) {

      console.log("Find One " + db_users_array);

      if (db_users_array) {
        var db_email = db_users_array.user_email;
        var db_password = db_users_array.user_password;

      }

      console.log("db_users_array.user_email " + db_email);
      console.log("db_users_array.user_password " + db_password);

      if (db_email == null) {
        console.log("If");
        res.end("Email not Found");
      }
      else if (db_email == email) {




        "use strict";
        const nodemailer = require("nodemailer");

        // async..await is not allowed in global scope, must use a wrapper
        async function main() {

          // Generate test SMTP service account from ethereal.email
          // Only needed if you don't have a real mail account for testing
          let account = await nodemailer.createTestAccount();

          // create reusable transporter object using the default SMTP transport
          let transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
              user: "pr3380611@gmail.com", // generated ethereal user
              pass: "Dixit@000" // generated ethereal password
            }
          });

          // setup email data with unicode symbols
          let mailOptions = {
            from: '"Fred Foo ????" <foo@example.com>', // sender address
            to: email, // list of receivers
            subject: "Forgot Password", // Subject line
            html: "<h2>Please find your forgot password link </h2> <br>http://127.0.0.1:3000/change-password" // html body
          };

          // send mail with defined transport object
          let info = await transporter.sendMail(mailOptions)

          console.log("Message sent: %s", info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          res.end("Password Sent on your Email");
          // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
          // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }

        main().catch(console.error);



      }
      else {
        console.log("Credentials wrong");
        res.end("Login invalid");
      }


    });
  });











  module.exports = router;