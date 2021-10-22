var express = require('express');
const mongoose = require('mongoose')
var StudentModel = require('../models/student');

var router = express.Router();



router.post('/add', function(req, res, next) {
  console.log(req.body);
  const mydata = {
    name : req.body.name,
    ph_no : req.body.phno,
    en_no : req.body.en_no,
    email : req.body.email,
    dept : req.body.dept
  }
  var data = StudentModel(mydata);

  data.save(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/students/display')
    }
  })
 
});

router.get('/display', function(req, res, next) {
  StudentModel.find(function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('student/display_student',{mydata : data})
      console.log(data)
    }
  }).lean();
});

router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  StudentModel.findByIdAndDelete(id,function(err,data){
    if(err){
      console.log("Error from delete section " + err)
    }else{
      console.log("Data Deleted.")
      console.log(data)
      res.redirect('/students/display')
    }
  })
});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  StudentModel.findById(id,function(err,data){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log("Data Updated.")
      console.log(data)
      res.render('student/edit_student' ,{mydata : data})
    }
  }).lean();
});

router.post('/edit/:id', function(req, res, next) {
  
  const mydata = {
    name : req.body.name,
    ph_no : req.body.phno,
    en_no : req.body.en_no,
    email : req.body.email,
    dept : req.body.dept
  }
  StudentModel.findByIdAndUpdate(req.params.id,mydata,function(err){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log(req.body);
      console.log("Data Updated.")
      res.redirect('/students/display')
    }
  })
  })

module.exports = router;
