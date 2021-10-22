var express = require('express');
var router = express.Router();
var CartModel = require('../models/cart');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/signup', function(req, res, next) {
  res.render('user/signup');
});


router.post('/login', function (req, res, next) {

  var email = req.body.email;
  var password = req.body.password;

  console.log(req.body);
  UsersModel.findOne({ "email": email }, function (err, db_users_array) {

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
      res.redirect('/home');
    }
    else {
      console.log("Credentials wrong");
      res.end("Login invalid");
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
  res.render('home', { myemail: myemail });
});



// router.get("/displaycart", (req,res)=>{res.send("Hello")})

module.exports = router;
