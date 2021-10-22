var express = require('express');
const mongoose = require('mongoose')
var UserModel = require('../models/user');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.post('/add', function(req, res, next) {
  console.log(req.body);
  const mydata = {
    name : req.body.name,
    ph_no : req.body.phno
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

router.get('/display', function(req, res, next) {
  UserModel.find(function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('display_data',{mydata : data})
      console.log(data)
    }
  }).lean();
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
      res.render('edit' ,{mydata : data})
    }
  }).lean();
});

router.post('/edit/:id', function(req, res, next) {
  
  const mydata = {
    name : req.body.name,
    ph_no : req.body.phno
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
