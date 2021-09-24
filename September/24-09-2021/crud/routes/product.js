var express = require('express');
var router = express.Router();

//Model Loading
var UserModel = require('../models/product_model');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
//add value into form
router.get('/add_product', function(req, res, next) {
  res.render('product/add_product');
});

router.post('/add-process1', function(req, res, next) {
  
  const mybodydata = {
    product_name : req.body.pname,
    product_code: req.body.pcode,
    product_price :req.body.pprice
  }
  
  var data = UserModel(mybodydata);

  data.save(function(err){
    if(err){
      console.log("Error in Add Record" + err);
    }else{
      console.log("Record Added");
      res.redirect('/product/add_product')
    }
  })
  
});
//display data
router.get('/display_product', function(req, res, next) {
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
      res.redirect('/product/display_product');
    }
  })
  res.render('add_product');
});
//edit
router.get('/edit_product/:id', function(req, res, next) {
  var editid = req.params.id;
  UserModel.findById(editid,function(err,data){
    if(err){
      console.log("Error in Edit" + err)
    }else{
      console.log(data);
      res.render('product/edit_product',{mydata:data})
    }
  }).lean();

});

router.post('/edit_product/:id', function(req, res, next) {
  var editid = req.params.id;
  const mybodydata = {
    product_name : req.body.pname,
    product_code: req.body.pcode,
    product_price :req.body.pprice
  }

  UserModel.findByIdAndUpdate(editid,mybodydata,function(err,data){
    if(err){
      console.log("Error in Edit" + err)
    }else{
      console.log( "Record Updated" +  data);

      res.redirect('/product/display_product');
    }
  }).lean();

});


module.exports = router;
