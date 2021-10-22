// var express = require('express');
// var router = express.Router();

// /* GET users listing. */
// router.get('/', function(req, res, next) {
//   res.send('respond with a resource');
// });

// module.exports = router;
var express = require('express');
var router = express.Router();

var SignUpModel=require('../model/signupmodel');
// var AdminModel = require('../model/admin');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
/*Get all data */
router.get('/get-users-api',function(req,res,next){
  SignUpModel.find({},function(err,mydata){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data listing","data":mydata}));
    }
  });
});
/*Get single data by id */
router.get('/get-users-details-api/:id',function(req,res,next){
  SignUpModel.findById(req.params.id,function(err,mydata){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data listing","data":mydata}));
    }
  });
});

router.get('/add-users-api', function(req, res, next) {
  res.render("/add-users-api");
});
//add all data
router.post('/add-users-api',function(req,res,next){
  console.log(req.body);
  const mybodydata ={
    email:req.body.email,
    password:req.body.password
  }
  var data =SignUpModel(mybodydata);
  data.save(function(err){
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error in api ","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"record added"}));
    }
  })
});

//delete data  by id
router.delete('/delete-users-api', function(req, res, next) {
  console.log(req.query)
  SignUpModel.findByIdAndRemove(req.query.id,function(err,post){
    console.log(post);
    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{

      res.send(JSON.stringify({"flag":1,"message":"data deleted"}));
    }
  });
});
//update data by id
router.put("/update-users-api/:id",function(req,res,next){
  console.log(req.params.id);
  SignUpModel.findByIdAndUpdate(req.params.id,req.body,function(err,post){

    if(err){
      res.send(JSON.stringify({"flag":0,"message":"Error","err":err}));
    }else{
      res.send(JSON.stringify({"flag":1,"message":"data updated"}));
    }
  });
});
