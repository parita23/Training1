var express = require('express');
const mongoose = require('mongoose')
var EmployeeModel = require('../models/employee');

var router = express.Router();



router.post('/add', function(req, res, next) {
  console.log(req.body);
  const mydata = {
    name : req.body.name,
    ph_no : req.body.phno,
    salary : req.body.salary,
    email : req.body.email,
    dept : req.body.dept
  }
  var data = EmployeeModel(mydata);

  data.save(function(err){
    if(err){
      console.log(err)
    }else{
      res.redirect('/employee/display')
    }
  })
 
});

router.get('/display', function(req, res, next) {
  EmployeeModel.find(function(err,data){
    if(err){
      console.log(err);
    }else{
      res.render('employee/display_employee',{mydata : data})
      console.log(data)
    }
  }).lean();
});

router.get('/delete/:id', function(req, res, next) {
  var id = req.params.id;
  EmployeeModel.findByIdAndDelete(id,function(err,data){
    if(err){
      console.log("Error from delete section " + err)
    }else{
      console.log("Data Deleted.")
      console.log(data)
      res.redirect('/employee/display')
    }
  })
});

router.get('/edit/:id', function(req, res, next) {
  var id = req.params.id;
  EmployeeModel.findById(id,function(err,data){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log("Data Updated.")
      console.log(data)
      res.render('employee/edit_employee' ,{mydata : data})
    }
  }).lean();
});

router.post('/edit/:id', function(req, res, next) {
  
  const mydata = {
    name : req.body.name,
    ph_no : req.body.phno,
    salary : req.body.salary,
    email : req.body.email,
    dept : req.body.dept
  }
  EmployeeModel.findByIdAndUpdate(req.params.id,mydata,function(err){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log(req.body);
      console.log("Data Updated.")
      res.redirect('/employee/display')
    }
  })
  })

module.exports = router;
