var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/registration', function(req, res, next) {
  res.render('registration');
});

router.get('/Home', function(req, res, next) {
  res.render('Home');
});

router.get('/contact', function(req, res, next) {
  res.render('contact');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

module.exports = router;
