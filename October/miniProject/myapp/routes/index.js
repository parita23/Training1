var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index');
// });

	

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log("Dashboard Called " + req.session.email);
  var myemail = req.session.email;
  var myid = req.session._id;
  console.log(myemail);
  console.log("your id is : ",myid);

  //Auth
  if (!req.session.email) {
      console.log("Email Session is Set");
      res.end("Login required to Access this page");
  }
  res.render('index', { myemail: myemail , myid: myid });
});
module.exports = router;
