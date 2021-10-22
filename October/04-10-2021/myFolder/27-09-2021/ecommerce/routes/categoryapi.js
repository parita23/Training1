var express = require('express');
var router = express.Router();

var CategoryModel = require('../models/category');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('category/addCategory');
});



router.post('/addCategory', function(req, res, next) {
    CategoryModel.find({ "name": req.body.name}, function (err, user_array) {
        if (err){ 
          console.log(err)
          throw err
        }
        if (user_array.length >= 1) {
            res.send({"Flag" : 0, "Message" : "Data already exists."})
        } else {
    
    var inputData = {
        name : req.body.name,
    }
    var data = CategoryModel(inputData);
    data.save(function(err){
        if(err) throw err;
        res.send({"Flag" : 1, "Message" : "Data added."})
    })
}
})
  });

  router.get('/displayCategory', function(req, res, next) {
    CategoryModel.find(function(err,data){
        if(err) throw err;
        res.send({"Flag" : 1, "Data" : data})
    }).lean();
  });
  

router.get('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    CategoryModel.findByIdAndDelete(id,function(err,data){
      if(err){
        console.log("Error from delete section " + err)
      }else{
        console.log("Data Deleted.")
        console.log(data)
        res.send({"Flag" : 1, "Message" : "Deleted"})
      }
    })
  });
  
  router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    CategoryModel.findById(id,function(err,data){
      if(err){
        console.log("Error from update section " + err)
      }else{
        console.log("Data Updated.")
        console.log(data)
        res.render('category/editCategory' ,{mydata : data})
      }
    }).lean();
  });
  
  router.post('/edit/:id', function(req, res, next) {
    
    const inputData = {
        name : req.body.name,
    }
    CategoryModel.findByIdAndUpdate(req.params.id,inputData,function(err){
      if(err){
        console.log("Error from update section " + err)
        res.send({"Flag" : 1, "Message" : "Error in Data Edite"})
      }else{
        console.log(req.body);
        console.log("Data Updated.")
        res.send({"Flag" : 1, "Message" : "Data Edited"})
      }
    })
    })


module.exports = router;