var express = require('express');
var router = express.Router();
 var fetch =require ('node-fetch');            ;

var ApiModel = require('../schema/api_table');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//Fetch API
router.get('/get-user',function(req,res){
  ApiModel.find(function(err,data_user){
      if(err){
        res.send("data not found");
      }
      else{
        res.send(data_user);
      }
  });
});

router.get('/show-user',async function(req,res){
      const response = await fetch('http://localhost:3000/get-user');
      const data = await response.json();
      res.render("showUser",{data});
});
//fetch weather api
router.get('/weather',async function(req,res){
  const response = await fetch("https://api.openweathermap.org/data/2.5/weather?q=porbandar&units=metric&APPID=fe51c92dee47c91adf48c94eeaefb343");
  const data1 = await response.json();
  console.log(data1);
  res.render("weatherDisplay",{mydata:data1});

});
module.exports = router;
