var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/user', function(req, res, next) {
  res.render('user/user');
});


router.get('/student', function(req, res, next) {
  res.render('student/student');
});


router.get('/employee', function(req, res, next) {
  res.render('employee/employee');
});



module.exports = router;
