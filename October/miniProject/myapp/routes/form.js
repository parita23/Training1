var express = require('express');

var router = express.Router();
var { check, validationResult } = require('express-validator')
var FormModel = require('../schema/form_table');
/* GET users listing. */
/**
 * 
 */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});

// -------------------  User Routes/Controller 
router.get('/add', function(req, res, next){
    res.render('admin/form/add');
});

router.post('/add', [
    check('name', 'Name should be more than 4 charachters').isLength({ min: 4 }),
    check('email', 'Email should be more than 10 charachters').isLength({ min: 10 }),
    check('mobile', 'Mobile should be 10 Digit and also enter valid indian mobile number').matches(/^([9]{1})([234789]{1})([0-9]{8})$/),
    check('password','Please enter a password at least 8 character and contain At least one uppercase.At least one lower case.At least one special character.').matches(/^((?=.*\d)(?=.*[A-Z])(?=.*\W).{8,8})$/),
    check('pancard','First five characters are letters (A-Z) and next 4 numerics (0-9) & last character letter (A-Z).').matches(/([A-Z]){5}([0-9]){4}([A-Z]){1}$/),
    check('aadhar','Aadhaar Card has total 12 digits and not start with 0 & 1 and not contain any alphabet & special characters and white space after every 4 digits').matches(/^[2-9]{1}[0-9]{3}\s{1}[0-9]{4}\s{1}[0-9]{4}$/),
    check('passport','Length should be minimum 3 characters to a maximum of 20 character & Should not be only 0').matches(/^[A-PR-WYa-pr-wy][1-9]\\d\\s?\\d{4}[1-9]$/),
    check('gst', 'please enter valid gst number').matches(/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/),
   

  ],
    function (req, res, next) {
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
        res.render('admin/form/add', {myerrors: er});
      }
      else {
        req.session.success = true;
        const mybodydata = {
          name: req.body.name,
          email: req.body.email,
          mobile: req.body.mobile,
          password: req.body.password,
         pancard: req.body.pancard,
         aadhar: req.body.aadhar,
         passport: req.body.passport,
         gst: req.body.gst,
          
      }
        var data = FormModel(mybodydata);
        data.save(function(err) {
          if (err) {
             console.log("Error in Insert Record");
          } else {
           res.redirect("/admin/form/display");
          }
      })
      }
});
router.get('/display', function(req, res, next) {
  FormModel.find(function(err, db_users_array) {
  if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      //Print Data in Console
      console.log(db_users_array);
      //Render User Array in HTML Table
      res.render('admin/form/display', { mydata: db_users_array });
    }
}).lean();
});


module.exports = router;