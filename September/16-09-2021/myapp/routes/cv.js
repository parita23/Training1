var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.render('cv');
  });
module.exports = router;
console.log("port runnining at localhost:3000");
