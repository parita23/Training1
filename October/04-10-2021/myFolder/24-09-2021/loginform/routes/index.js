var express = require('express');
var router = express.Router();
var UserModel = require('../models/user');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/login', function (req, res, next) {
  res.render('login');
});

router.get('/signup', function (req, res, next) {
  res.render('index');
});

router.get('/forgotpassword', function (req, res, next) {
  res.render('index');
});

router.post('/login', function (req, res, next) {
  res.redirect('/home')
});

router.post('/formprocess', function (req, res, next) {
  console.log(req.body);
  const mydata = {
    name: req.body.name,
    phno: req.body.phno,
    gender: req.body.gender,
    email: req.body.email,
    password: req.body.password
  }
  var data = UserModel(mydata);

  data.save(function (err) {
    if (err) {
      console.log(err)
    } else {
      res.redirect('/display')
    }
  })

});

router.get('/home',function(req,res,next){
  var userEmail = req.body.email
  var userPassword = req.body.password
  UserModel.find({"email" : userEmail}, function(err, data){
    if(err) throw err;
    var dbEmail  = data.email;
    console.log(dbEmail)
    var dbPassword = data.password;
    console.log(dbPassword)
  })
  if(dbEmail == null){
    res.send("Name not found")
  }else if(userEmail == dbEmail && userPassword == dbPassword){
    res.send("<h1>Welcome to home page</h1>")
    req.session.email = dbEmail;
  }else{
    res.end("Invalid User")
  }
})

module.exports = router;
