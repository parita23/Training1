	
var express = require('express');
var router = express.Router();

//Call Database Model
var adminModel = require('../schema/admin_table');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/login', function(req, res, next) {
  res.render('admin/account/login', {layout:false});
});

router.post('/login', function(req, res, next) {
    console.log("Login process");
    var email = req.body.email;
    var password = req.body.password;

console.log(req.body);
adminModel.findOne({ "email": email }, function(err, db_admin_data) {

    // console.log("Find One " + db_admin_data);

    if (db_admin_data) {
        var db_id = db_admin_data._id;
        var db_email = db_admin_data.email;
        var db_password = db_admin_data.password;

    }
    // console.log("db_admin_data._id " + db_id);
    // console.log("db_admin_data.email " + db_email);
    // console.log("db_admin_data.password " + db_password);

    if (db_email == null) {
        console.log("If");
        res.end("Email not Found");
    } else if (db_email == email && db_password == password) {
        console.log("i m inside....")
        req.session.email = db_email;
        req.session._id = db_id;
        res.redirect('/');
    } else {
        console.log("Credentials wrong");
        res.end("Login invalid");
    }
});
});

router.get('/forgot-password', function(req, res, next) {
    res.render('admin/account/forgot-password',{layout: false});
  });

router.post('/forgot-password', function(req, res, next) {
    var email = req.body.email;

// console.log(req.body);
adminModel.findOne({ "email": email }, function(err, db_admin_data) {

    console.log("Find One " + db_admin_data);

    if (db_admin_data) {
        var db_email = db_admin_data.email;
        var db_password = db_admin_data.password;
    }

    // console.log("db_admin_data.email " + db_email);
    // console.log("db_admin_data.password " + db_password);

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
                    user: 'test.paritalearning@gmail.com',
                    pass: 'Parita@23',
                }
            });

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'test.paritalearning@gmail.com', // sender address
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

  router.get('/change-password', function(req, res, next) {
    if (!req.session.email) {
        console.log("Email Session is Set");
        res.redirect('/admin/account/login');
    }
        res.render('admin/account/change-password');
  });

  router.post('/change-password', function(req, res, next) {
  if (!req.session.email) {
        console.log("Email Session is Set");
        res.redirect('/admin/account/login');
    }
    console.log("Home Called " + req.session.email);
    var myemail = req.session.email;
    var opass = req.body.opass;
    var npass = req.body.npass;
    var cpass = req.body.cpass;

adminModel.findOne({ "email": myemail }, function(err, db_admin_data) {
    if (err) {
        console.log("Error in Old Password Fetch " + err);
    } else {
        console.log(db_admin_data);


        if (opass == db_admin_data.password) {

            if (opass == npass) {
                res.end("New Password Must be Different then Old password");
            } else {

                if (npass == cpass) {

                    adminModel.findOneAndUpdate({ "email": myemail }, { $set: { "password": npass } }, function(err) {

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
    res.redirect("/admin/account/login");
});



//   myprofile
router.get('/myprofile', function(req, res) {
    if(req.session._id){
        // console.log("my id json : ",req.params.myid);
    // console.log("my id object : ", JSON.parse(myid))

adminModel.findById(req.session._id, function(err, db_admin_data) {
    if (err) {
        console.log("display Fetch Error " + err);
    } else {
        console.log(db_admin_data);

        res.render('admin/account/myprofile', { admin_data: db_admin_data });
    }
}).lean();
    }else{}
});

router.get('/edit_myprofile', function(req, res) {
    console.log("my id json : ",req.session._id);
    // console.log("my id object : ", JSON.parse(myid))

adminModel.findById(req.session._id, function(err, db_admin_data) {
    if (err) {
        console.log("display Fetch Error " + err);
    } else {
        console.log(db_admin_data);
        res.render('admin/account/edit_myprofile', { admin_data: db_admin_data });
    }
}).lean();
});

//Update Record Using Post Method
router.post('/edit_myprofile', function(req, res) {
console.log("Edit ID is"+ req.session._id);
  var id = req.session._id;
    const mybodydata = {
      email: req.body.email 
    }
    adminModel.findByIdAndUpdate(req.session._id, mybodydata, function(err) {
        if (err) {
            console.log("Error in Record Update");
            res.send("profile updated Failed...");
            // res.redirect('/admin/account/category');
        } else {
            res.redirect("/admin/account/myprofile");
        }
    });
});

module.exports = router;

