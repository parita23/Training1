// var express = require('express');
// var router = express.Router();

// /* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });


// module.exports = router;
var express = require('express');
var router = express.Router();
const saltedSha512 = require('salted-sha512');
//Call User Database Model
var jqueryModel = require('../schema/indexTable');
let shaKey="SUPER-S@LT!";
var md5 = require('md5');
const MaskData = require('maskdata');

function splitDash(number){
 return number.split('-').join('');
}

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

// router.get('/add', function(req, res, next) {
//   res.render('admin/category/add-category');
// });


//Add Form Processing using Post Method 
router.post('/',  function (req, res, next) {
  console.log(req.body);

  //Create an Array 
  const mybodydata = {
    myname: req.body.myname,
    myemail: req.body.myemail,
    password:saltedSha512(req.body.password, shaKey),
    mobile:splitDash(req.body.mobile)

  }

  var data = jqueryModel(mybodydata);


  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.redirect('/login');
    }
  })

});
//email exist or not
router.get('/existOrNotValidation', async function(req,res){
  let data = await jqueryModel.findOne({myemail:req.query.myemail})

  if(data){
    res.send(false);
  }else{
    res.send(true);
  }
});

router.get('/login', function (req, res, next) {
  res.render('login', { layout: false });
});

router.post('/login', function (req, res, next) {
  let myemail = req.body.myemail;
  let password =saltedSha512(req.body.password, shaKey);
  console.log(req.body);
  jqueryModel.findOne({ myemail: myemail }, function (err, db_array) {
    console.log(db_array);
    
    if(err){
      res.redirect("/login");
    }
    else
    {
      if (db_array.myemail == myemail && db_array.password==password) {
        res.end("you are logged in");
      }
      else {
        res.end("sorry");
      }
    }
    });


});

module.exports = router;