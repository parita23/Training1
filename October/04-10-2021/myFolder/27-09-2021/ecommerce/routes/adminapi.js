var express = require('express');
var router = express.Router();

var AdminModel = require('../models/admin');

/* GET home page. */

router.get('/', function(req, res, next) {
  res.render('admin/adminSignup');
});

router.get('/login', function(req, res, next) {
    res.render('admin/adminLogin');
  });

  router.get('/forgot-password', function (req, res, next) {
    res.render('user/userForgotPassword');
  });


  //Login Process  Method
  router.post('/forgot-password', function (req, res, next) {

    var email = req.body.email;

    console.log(req.body);
    AdminModel.findOne({ "email": email }, function (err, db_users_array) {

      console.log("Find One " + db_users_array);

      if (db_users_array) {
        var db_email = db_users_array.email;
        var db_password = db_users_array.password;

      }

      console.log("db_users_array.email " + db_email);
      console.log("db_users_array.password " + db_password);

      if (db_email == null) {
        console.log("If");
        res.send({"Flag" : 0 , "Message" : "Email is not found"})
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
            from: '"Ecommerce" pr3380611@gmail.com', // sender address
            to: email, // list of receivers
            subject: "Forgot Password", // Subject line
            html: "<h2>Please find your forgot password link </h2> <br>http://127.0.0.1:3000/admin/change-password" // html body
          };

          // send mail with defined transport object
          let info = await transporter.sendMail(mailOptions)

          console.log("Message sent: %s", info.messageId);
          // Preview only available when sending through an Ethereal account
          console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

          res.send({"Flag" : 1 , "Message" : "Password link sent on a mail"})
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




router.post('/loginprocess', function (req, res, next) {

    var email = req.body.email;
    var password = req.body.password;

    console.log(req.body);
    AdminModel.findOne({ "email": email }, function (err, db_users_array) {

      console.log("Find One " + db_users_array);

      if (db_users_array) {
        var db_email = db_users_array.email;
        var db_password = db_users_array.password;

      }

      console.log("db_users_array.user_email " + db_email);
      console.log("db_users_array.user_password " + db_password);

      if (db_email == null) {
        res.end("Email not Found");
      }
      else if (db_email == email && db_password == password) {
        req.session.email = db_email;
        res.redirect('/admin/home')
      }
      else {
        console.log("Credentials wrong");
        res.send({"Flag" : 0, "Message" : "Invalid Creditials"})
      }


    });
  });

  
  router.get('/home', function (req, res, next) {

    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    console.log(myemail);

    //Auth
    if (!req.session.email) {
      console.log("Email Session is Set");
      res.end("Login required to Access this page");
    }
    res.render('admin/adminHome', { myemail: myemail });
  });


router.post('/signupprocess', function(req, res, next) {
    AdminModel.find({ "email": req.body.email}, function (err, user_array) {
        if (err){ 
          console.log(err)
          throw err
        }
        if (user_array.length >= 1) {
            res.send({"Flag" : 0, "Message" : "User already exists."})
        } else {
    
    var inputData = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    }
    var data = AdminModel(inputData);
    data.save(function(err){
        if(err) throw err;
        res.send({"Flag" : 1, "Message" : "Login Successfuls"})
    })
}
})
  });

  router.get('/change-password', function (req, res, next) {

    if (!req.session.email) {
      console.log("Email Session is Set");
      res.redirect('/login');
    }

    res.render('admin/adminChangePassword');
  });

  router.get('/logout', function (req, res) {

    req.session.destroy();
    res.redirect("/");
  });


  router.post('/change-password', function (req, res, next) {
    if (!req.session.email) {
      console.log("Email Session is Set");
      res.redirect('/admin/login');
    }
    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    var opass = req.body.opass;
    var npass = req.body.npass;
    var cpass = req.body.cpass;

    AdminModel.findOne({ "email": myemail }, function (err, db_users_array) {

      if (err) {
        console.log("Error in Old Password Fetch " + err);
      } else {
        console.log(db_users_array);


        if (opass == db_users_array.password) {

          if (opass == npass) {
            res.send({"Flag" : 0, "Message" : "New password is not same as the old password"})
          } else {

            if (npass == cpass) {

              AdminModel.findOneAndUpdate({ "email": myemail }, { $set: { "password": npass } }, function (err) {

                if (err) {
                    res.send({"Flag" : 0, "Message" : "Error in update"})
                } else {

                    res.send({"Flag" : 0, "Message" : "Password changed."})
                }

              });



            } else {
                res.send({"Flag" : 0, "Message" : "New Password and confirm password is not match"})
            }

          }

        } else {
            res.send({"Flag" : 0, "Message" : "Old password is not match"})
        }


      }


    });



  });




  router.get('/displayAdmin', function(req, res, next) {
    AdminModel.find(function(err,data){
        if(err) throw err;
        res.send({"Flag" : 1, "Data" : data})
    }).lean();
  });
  

router.get('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    AdminModel.findByIdAndDelete(id,function(err,data){
      if(err){
        console.log("Error from delete section " + err)
      }else{
        console.log("Data Deleted.")
        console.log(data)
        res.send({"Flag" : 1, "Message" : "Message Deleted successfully."})
      }
    })
  });
  
  router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    AdminModel.findById(id,function(err,data){
      if(err){
        console.log("Error from update section " + err)
      }else{
        console.log("Data Updated.")
        console.log(data)
        res.render('admin/editAdmin' ,{mydata : data})
      }
    }).lean();
  });
  
  router.post('/edit/:id', function(req, res, next) {
    
    const inputData = {
        name : req.body.name,
        email : req.body.email,
        password : req.body.password,
    }
    AdminModel.findByIdAndUpdate(req.params.id,inputData,function(err){
      if(err){
        console.log("Error from update section " + err)
        res.send({"Flag" : 0, "Message" : "Error in data update."})
      }else{
        console.log(req.body);
        console.log("Data Updated.")
        res.send({"Flag" : 1, "Message" : "Data Updated"})
      }
    })
    })


module.exports = router;