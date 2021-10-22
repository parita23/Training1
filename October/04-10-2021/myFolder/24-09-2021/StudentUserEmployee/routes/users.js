var express = require('express');
const mongoose = require('mongoose')
var UserModel = require('../models/user');

var router = express.Router();



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
      res.redirect('/users/display')
    }
  })
 
});

router.get('/display', function(req, res, next) {
  UserModel.find(function(err,data){
    if(err){
      console.log(" Display Error :- " + err);
    }else{
      res.render('user/display_data',{mydata : data})
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
      res.redirect('/users/display')
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
      res.render('user/edit' ,{mydata : data})
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
      res.redirect('/users/display')
    }
  })
  })

module.exports = router;
