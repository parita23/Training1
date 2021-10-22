var express = require('express');
const mongoose = require('mongoose')
var UserModel = require('../models/user');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/display', function(req, res, next) {
  UserModel.find(function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('datatable',{mydata : data})
      console.log(data)
    }
  }).lean();
});

router.post('/formprocess', function(req, res, next) {
  console.log(req.body);
  const mydata = {
    name : req.body.name,
    phno : req.body.phno,
    password : req.body.password,
    email : req.body.email,
    age : req.body.age
  }
  var data = UserModel(mydata);

  data.save(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/display')
    }
  })
});

router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  UserModel.findByIdAndDelete(id,function(err,data){
    if(err){
      console.log("Error from delete section " + err)
    }else{
      console.log("Data Deleted.")
      console.log(data)
      res.redirect('/display')
    }
  })
});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  UserModel.findById(id,function(err,data){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log("Data Updated.")
      console.log(data)
      res.render('edit_data' ,{mydata : data})
    }
  }).lean();
});

router.post('/edit/:id', function(req, res, next) {
  
  const mydata = {
    name : req.body.name,
    phno : req.body.phno,
    password : req.body.password,
    email : req.body.email,
    age : req.body.age
  }
  UserModel.findByIdAndUpdate(req.params.id,mydata,function(err){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log(req.body);
      console.log("Data Updated.")
      res.redirect('/display')
    }
  })
  })


module.exports = router;
