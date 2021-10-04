var express = require('express');
var router = express.Router();

var UsersModel = require('../models/usertable');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


//signup get page
router.get('/signup', function(req, res, next) {
    res.render('signup');
});

//Signup  post Page Processing
router.post('/signup', function(req, res, next) {
    console.log(req.body);

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

    data.save(function(err) {
        if (err) {
            console.log("Error in Insert Record" + err);
        } else {
            console.log(mybodydata);
            res.render('signup');
        }
    })

});


//login page get method
router.get('/login', function(req, res, next) {
    res.render('login');
});

//Login Process  Method
router.post('/login', function(req, res, next) {

    var email = req.body.user_email;
    var password = req.body.user_password;

    console.log(req.body);
    UsersModel.findOne({ "user_email": email }, function(err, db_users_array) {

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
        } else if (db_email == email && db_password == password) {
            req.session.email = db_email;
            res.redirect('/home');
        } else {
            console.log("Credentials wrong");
            res.end("Login invalid");
        }
    });
});

//Home Page 
router.get('/home', function(req, res, next) {

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
router.get('/change_password', function(req, res, next) {

    if (!req.session.email) {
        console.log("Email Session is Set");
        res.redirect('/login');
    }

    res.render('change_password');
});

//Change Password Process Page

router.post('/change_password', function(req, res, next) {
    if (!req.session.email) {
        console.log("Email Session is Set");
        res.redirect('/login');
    }
    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    var opass = req.body.opass;
    var npass = req.body.npass;
    var cpass = req.body.cpass;

    UsersModel.findOne({ "user_email": myemail }, function(err, db_users_array) {
        if (err) {
            console.log("Error in Old Password Fetch " + err);
        } else {
            console.log(db_users_array);


            if (opass == db_users_array.user_password) {

                if (opass == npass) {
                    res.end("New Password Must be Different then Old password");
                } else {

                    if (npass == cpass) {

                        UsersModel.findOneAndUpdate({ "user_email": myemail }, { $set: { "user_password": npass } }, function(err) {

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
router.get('/logout', function(req, res) {

    req.session.destroy();
    res.redirect("/");
});


//Forgot Password Get Method
router.get('/forgot_password', function(req, res, next) {
    res.render('forgot_password');
});


//Login Process  Method
router.post('/forgot_password', function(req, res, next) {

    var email = req.body.user_email;

    console.log(req.body);
    UsersModel.findOne({ "user_email": email }, function(err, db_users_array) {

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
        } else if (db_email == email) {




            "use strict";
            const nodemailer = require("nodemailer");

            // async..await is not allowed in global scope, must use a wrapper
            async function main() {

                // Generate test SMTP service account from ethereal.email
                // Only needed if you don't have a real mail account for testing
                let account = await nodemailer.createTestAccount();

                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    service: 'gmail', // true for 465, false for other ports
                    auth: {
                        user: 'test.jimita@gmail.com',
                        pass: 'TestJimita@49'
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'test.jimita@gmail.com', // sender address
                    to: db_email, // list of receivers
                    subject: "Forgot Password", // Subject line
                    text: "Hello your password is " + db_password, // plain text body
                    html: "Hello your password is " + db_password // html body
                };

                // send mail with defined transport object
                let info = await transporter.sendMail(mailOptions)

                console.log("Message sent: %s", info.messageId);

                console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));

                res.end("Password Sent on your Email");

            }

            main().catch(console.error);



        } else {
            console.log("Credentials wrong");
            res.end("Login invalid");
        }


    });
});

router.get('/display_table', function(req, res, next) {

    UsersModel.find(function(err, db_users_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
        } else {
            //Print Data in Console
            console.log(db_users_array);
            //Render User Array in HTML Table
            res.render('display_table', { user_array: db_users_array });

        }
    }).lean();

});
/*
//Get Single User By ID
router.get('/show/:id', function (req, res) {
  console.log(req.params.id);
  UsersModel.findById(req.params.id, function (err, db_users_array) {
    if (err) {
      console.log("Error in Single Record Fetch" + err);
    } else {
      console.log(db_users_array);

      res.render('single_record', { user_array: db_users_array });
    }
  });
});
*/

//Delete User By ID
router.get('/delete/:id', function(req, res) {
    UsersModel.findOneAndDelete(req.params.id, function(err, project) {
        if (err) {

            console.log("Error in Record Delete " + err);
            res.redirect('/display_table');
        } else {

            console.log(" Record Deleted ");
            res.redirect('/display_table');
        }
    });
});

//Get Single User for Edit Record
router.get('/edit_form/:id', function(req, res) {
    console.log(req.params.id);

    UsersModel.findById(req.params.id, function(err, db_users_array) {
        if (err) {
            console.log("Edit Fetch Error " + err);
        } else {
            console.log(db_users_array);

            res.render('edit_form', { user_array: db_users_array });
        }
    }).lean();
});


//Update Record Using Post Method
router.post('/edit_form/:id', function(req, res) {

    console.log("Edit ID is" + req.params.id);

    const mybodydata = {
        user_name: req.body.user_name,
        user_mobile: req.body.user_mobile
    }

    UsersModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
        if (err) {
            console.log("Error in Record Update");
            res.redirect('/display_table');
        } else {

            res.redirect('/display_table');
        }
    });
});

module.exports = router;