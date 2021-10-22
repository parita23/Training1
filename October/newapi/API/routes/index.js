// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });

// module.exports = router;
var express = require('express');
var router = express.Router();
var { check, validationResult } = require('express-validator')
const { body } = require('express-validator');
var SignUpModel=require('../model/signupmodel');
// var AdminModel = require('../model/admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*Get all data */
router.get('/get-users-api',function(req,res,next){
  SignUpModel.find({},function(err,mydata){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data listing","data":mydata}));
    }
  });
});
/*Get single data by id */
router.get('/get-users-details-api/:id',function(req,res,next){
  SignUpModel.findById(req.params.id,function(err,mydata){
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
router.post('/add-users-api', [
  check('name', 'Name should be more than 4 charachters').isLength({ min: 4 }).trim().escape(),
  check('email', 'Email should be more than 10 charachters').isLength({ min: 10 }).not().isEmpty().isEmail().normalizeEmail().custom((value, { req }) => {
    return new Promise((resolve, reject) => {
      SignUpModel.findOne({ 'email': value }, (err, user) => {
          if(user !== null) {
             return reject();
          } else {
             return resolve();
          }
       });
    });
 }).withMessage('This email is already in use'),
  check('password','Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.').matches(/^((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,8})$/),
  check('contact', 'Mobile should be 10 Digit and also enter valid indian mobile number').matches(/^([9]{1})([234789]{1})([0-9]{8})$/).isMobilePhone(),
  
],

function(req,res,next){
  console.log(req.body)
  var errors = validationResult(req).array();
  console.log("errors property : ", errors);
  if (errors.length) {
    let er = {};
    for (let err of errors) {
      if (er[err.param]) {
        console.log("er is in if : ", er);
        er[err.param].push(err.msg); 
      } else {
        console.log("er is in else : ", er);
        er[err.param] = [];
        er[err.param].push(err.msg);
        console.log("er is in else after : ", er);  
      }
    }
    console.log("my error is : ",er); 

    res.send(JSON.stringify({"flag":0,"message":"Error in api ","myerrors":er}));
  }
  else{
    const mybodydata ={
      name:req.body.name,
     address:req.body.address,
     email:req.body.email,
     password:req.body.password,
     contact:req.body.contact
    }
  
 
  var data =SignUpModel(mybodydata);
  data.save(function(err){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error in api ","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"sign up successfully"}));
    }
  })
}
});
//delete data  by id
router.delete('/delete-users-api', function(req, res, next) {
  console.log(req.query)
  SignUpModel.findByIdAndRemove(req.query.id,function(err,post){
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
  SignUpModel.findByIdAndUpdate(req.params.id,req.body,function(err,post){

    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data updated"}));
    }
  });
});
//login
router.post('/admin-login', function (req, res, next) {
  var email = req.body.email;
  console.log(email);
  var password = req.body.password;
   console.log(password);
  console.log(req.body);
  SignUpModel.findOne({ "email": email }, function (err, db_users_array) {

    console.log("Find One " + db_users_array);

    if (db_users_array) {
      var db_email = db_users_array.email;
      var db_password = db_users_array.password;

    }

    console.log("db_users_array.user_email " + db_email);
    console.log("db_users_array.user_password " + db_password);

    if (db_email == null) {
      console.log("If");
      res.send(JSON.stringify({"flag":0,"message":"email not found"}));
    }
    else if (db_email == email && db_password == password) {
            
      res.send(JSON.stringify({"flag":1,"message":"you are logged in sucessfully"}));
    }
    else {
      console.log("Credentials wrong");
      res.send(JSON.stringify({"flag":0,"message":"login invalid"}));
    }
 });
});
// //login
// router.post('/admin-login', function (req, res, next) {
//   var email = req.body.email;
//   var password = req.body.password;
//   console.log(req.body);
//   SignUpModel.findOne({ "email": email }, function (err, db_users_array) {

//     console.log("Find One " + db_users_array);

//     if (db_users_array) {
//       var db_email = db_users_array.email;
//       var db_password = db_users_array.password;

//     }

//     console.log("db_users_array.user_email " + db_email);
//     console.log("db_users_array.user_password " + db_password);

//     if (db_email == null) {
//       console.log("If");
//       res.send(JSON.stringify({"flag":0,"message":"email not found"}));
//     }
//     else if (db_email == email && db_password == password) {
            
//       req.session.email = db_email;
//       res.send(JSON.stringify({"flag":1,"message":"you are logged in sucessfully"}));
//     }
//     else {
//       console.log("Credentials wrong");
//       res.send(JSON.stringify({"flag":0,"message":"login invalid"}));
//     }
//  });
// });
module.exports = router;