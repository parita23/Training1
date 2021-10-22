var express = require('express');
var router = express.Router();

var UsersModel=require('../model/usermodel');
var AdminModel = require('../model/admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*Get all data */
router.get('/get-users-api',function(req,res,next){
  UsersModel.find({},function(err,mydata){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data listing","data":mydata}));
    }
  });
});
/*Get single data by id */
router.get('/get-users-details-api/:id',function(req,res,next){
  UsersModel.findById(req.params.id,function(err,mydata){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data listing","data":mydata}));
    }
  });
});

router.get('/add-users-api', function(req, res, next) {
  res.render("/add-users-api");
});
//add all data
router.post('/add-users-api',function(req,res,next){
  console.log(req.body);
  const mybodydata ={
    user_name:req.body.user_name,
    user_email:req.body.user_email
  }
  var data =UsersModel(mybodydata);
  data.save(function(err){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error in api ","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"record added"}));
    }
  })
});

//delete data  by id
router.delete('/delete-users-api', function(req, res, next) {
  console.log(req.query)
  UsersModel.findByIdAndRemove(req.query.id,function(err,post){
    console.log(post);
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{

      res.send(JSON.stringify({"flag":1,"message":"data deleted"}));
    }
  });
});
//update data by id
router.put("/update-users-api/:id",function(req,res,next){
  console.log(req.params.id);
  UsersModel.findByIdAndUpdate(req.params.id,req.body,function(err,post){

    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data updated"}));
    }
  });
});






//admin start

router.get('/admin-form', function(req, res, next) {
  res.render('admin-form');
});
router.post('/admin-process', function (req, res, next) {
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
  var data = AdminModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record" + err);
    } else {
      console.log("Record Added");
      res.redirect("/admin-form");
    }
  })

});
router.get('/admin-display', function (req, res, next) {

  AdminModel.find(function (err, db_users_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      //Print Data in Console
      console.log(db_users_array);
      //Render User Array in HTML Table
      res.render('admin-display', { user_array: db_users_array });

    }
  }).lean();

});


router.get('/admin-login', function(req, res, next) {
  res.render('admin-login');
});

//Login Process  Method
router.post('/admin-login', function (req, res, next) {
  var email = req.body.user_email;
  var password = req.body.user_password;
  console.log(req.body);
  AdminModel.findOne({ "user_email": email }, function (err, db_users_array) {

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
    else if (db_email == email && db_password == password) {
            
      req.session.email = db_email;
      res.redirect('/admin-home');
    }
    else {
      console.log("Credentials wrong");
      res.end("Login invalid");
    }
 });
});
router.get('/admin-home', function (req, res, next) {
  var myemail = req.session.email;
  console.log("Home Called " + req.session.email);

  console.log(myemail);

  //Auth
  if (!req.session.email) {
    console.log("Email Session is Set");
    res.end("Login required to Access this page");
  }
  res.render('admin-home', { myemail: myemail });
});


router.get('/admin-changepw', function (req, res, next) {
  var myemail = req.session.email;
  if (!req.session.email) {
    console.log("Email Session is Set");
    res.redirect('/admin-login');
  }

  res.render('admin-changepw');
});


//Change Password Process Page

router.post('/admin-changepw', function (req, res, next) {
  if (!req.session.email) {
    console.log("Email Session is Set");
    res.redirect('admin-login');
  }
  console.log("Home Called " + req.session.email);
  var myemail = req.session.email;
  var opass = req.body.opass;
  var npass = req.body.npass;
  var cpass = req.body.cpass;

  AdminModel.findOne({ "user_email": myemail }, function (err, db_users_array) {
    if (err) {
      console.log("Error in Old Password Fetch " + err);
    } else {
      console.log(db_users_array);


      if (opass == db_users_array.user_password) {

        if (opass == npass) {
          res.end("New Password Must be Different then Old password");
        } else {

          if (npass == cpass) {

            AdminModel.findOneAndUpdate({ "user_email": myemail }, {$set: {"user_password": npass}}, function (err) {
           
              if(err)
              {
                res.end("Error in Update"+err);
              }else{ 

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

router.get('/admin-logout', function (req, res) {
  req.session.destroy();
  res.redirect('/admin-login');
});



//Forgot Password Get Method
router.get('/admin-forgotpw', function (req, res, next) {
  res.render('admin-forgotpw');
});


//Login Process  Method
router.post('/admin-forgotpw', function (req, res, next) {

  var email = req.body.user_email; 

  console.log(req.body);
  AdminModel.findOne({ "user_email": email }, function (err, db_users_array) {

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
async function main(){

  // Generate test SMTP service account from ethereal.email
  // Only needed if you don't have a real mail account for testing
  let account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    service: 'gmail', // true for 465, false for other ports
    auth: {
      user: 'testfor.dhanvigajjar@gmail.com',
      pass: 'Dhanvi@13'
    }
  });

  // setup email data with unicode symbols
  let mailOptions = {
    from: 'testfor.dhanvigajjar@gmail.com', // sender address
    to: 'gajjardhanvi456@gmail.com', // list of receivers
    subject: "Forgot Password", // Subject line
    text: "Hello your password is "  + db_password, // plain text body
    html: "Hello your password is "  + db_password // html body
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


router.get('/admin-delete/:id', function (req, res) {
  AdminModel.findOneAndDelete(req.params.id, function (err, project) {
    if (err) {

      console.log("Error in Record Delete " + err);
      res.redirect('/admin-display');
    } else {

      console.log(" Record Deleted ");
      res.redirect('/admin-display');
    }
  });
});

router.get('/admin-edit/:id', function (req, res) {
  var editid = req.params.id;
  console.log(req.params.id);

  AdminModel.findById(req.params.id, function (err, db_users_array) {
    if (err) {
      console.log("Edit Fetch Error " + err);
    } else {
      console.log(db_users_array);

      res.render('admin-edit', { user_array: db_users_array });
    }
  }).lean();
});


router.post('/admin-edit/:id', function (req, res) {
  var editid = req.params.id;
  console.log("Edit ID is" + req.params.id);

  const mybodydata = {
    user_name: req.body.user_name,
    user_mobile: req.body.user_mobile
  }

 AdminModel.findByIdAndUpdate(req.params.id, mybodydata, function (err,db_users_array) {
    if (err) {
      console.log("Error in Record Update");
    } else {
      console.log( "Record Updated" + db_users_array );
      res.redirect('/admin-display');
      
    }
  });
});




module.exports = router;