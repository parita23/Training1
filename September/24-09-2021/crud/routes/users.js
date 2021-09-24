var express = require('express');
var router = express.Router();

//Model Loading
var UserModel = require('../models/user_model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//add value into form
router.get('/add', function(req, res, next) {
  res.render('users/add');
});

router.post('/add-process', function(req, res, next) {
  
  const mybodydata = {
    user_name : req.body.txt1,
    user_mobile : req.body.txt2
  }
  var data = UserModel(mybodydata);

  data.save(function(err){
    if(err){
      console.log("Error in Add Record" + err);
    }else{
      console.log("Record Added");
      res.redirect('/users/add')
    }
  })
  
});
//display data
router.get('/display', function(req, res, next) {
  UserModel.find(function(err,data){
    if(err){
      console.log("Error in Fetch Data" + err);
    }else{
      console.log("Record Data is " + data);
      res.render('users/display',{mydata:data});
    }
  }).lean();
});
//delete data
router.get('/delete/:id', function(req, res, next) {
  var deleteid = req.params.id;
  UserModel.findByIdAndDelete(deleteid,function(err,data){
    if(err)
    {
      console.log("Error in Delete " + err);
    }else{
      console.log("Record Deleted " + deleteid);
      res.redirect('/users/display');
    }
  })
  res.render('add');
});
//edit
router.get('/edit/:id', function(req, res, next) {
  var editid = req.params.id;
  UserModel.findById(editid,function(err,data){
    if(err){
      console.log("Error in Edit" + err)
    }else{
      console.log(data);
      res.render('users/edit',{mydata:data})
    }
  }).lean();

});

router.post('/edit/:id', function(req, res, next) {
  var editid = req.params.id;
  const mybodydata = {
    user_name : req.body.txt1,
    user_mobile : req.body.txt2
  }

  UserModel.findByIdAndUpdate(editid,mybodydata,function(err,data){
    if(err){
      console.log("Error in Edit" + err)
    }else{
      console.log( "Record Updated" +  data);

      res.redirect('/users/display');
    }
  }).lean();

});


module.exports = router;
