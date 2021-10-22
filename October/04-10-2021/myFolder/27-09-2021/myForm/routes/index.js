var express = require('express');
var UserModel = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/add', function (req, res, next) {
  console.log(req.body);
  const mydata = {
    name: req.body.name,
    phno: req.body.phno,
    age: req.body.age,
    email: req.body.email,
    joinDate: req.body.date,
    fileObject: req.files.file
  }
  var data = UserModel(mydata)
  data.save(function(err){
    if(err) throw err;
  })

  var fileName = req.files.file.name;
  var fileType = req.files.file.mimetype;
  var fileSize = req.files.file.size;
  var fileObject = req.files.file;
  
  if(fileSize <= 2*1024*1024 && (fileType == 'image/jpeg' || fileType == 'image/png') ){
    console.log(__dirname)
    fileObject.mv("public/images/" + fileName ,function(err){
      if(err) throw err;
      res.send("File Uploaded...")
    })
  } else{
    res.send('<h1> File size must be 2Mb and Type of file is jpeg only allowed.</h1>')
  }
  console.log(fileObject);
});


router.get('/display', function(req, res, next) {
  StudentModel.find(function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('/display_student',{mydata : data})
      console.log(data)
    }
  }).lean();
  
});


module.exports = router;
