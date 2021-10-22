var express = require('express');
var router = express.Router();

var ProductModel = require('../models/product');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('product/addProduct');
});



router.post('/addproduct', function(req, res, next) {
    var fileType = req.files.file.mimetype;
    var fileSize = req.files.file.size;
    if(fileSize <= 2*1024*1024 && (fileType == 'image/jpeg' || fileType == 'image/png') ){
    var inputData = {
        name : req.body.name,
        price : req.body.price,
        qty : req.body.qty,
        details : req.body.details,
        imgName : req.files.file.name
    }
    var fileName = req.files.file.name;

    var fileObject = req.files.file;
    
    
      console.log(__dirname)
      fileObject.mv("public/images/" + fileName ,function(err){
        if(err) throw err;
        res.send("File Uploaded...")
        var data = ProductModel(inputData);
        data.save(function(err){
            if(err) throw err;
            res.send({"Flag" : 1 ,"Message" : "Data Added"})
        })
      })
    } else{
        res.send({"Flag" : 1 ,"Message" : "File size must be lessthan 2mb and type is jpeg and png"})
    }
   
  });

  router.get('/displayProduct', function(req, res, next) {
    ProductModel.find(function(err,data){
        if(err) throw err;
        res.send({"Flag" : 1 ,"Data" : data})
    }).lean();

  });
  

router.delete('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    ProductModel.findByIdAndDelete(id,function(err,data){
      if(err){
        console.log("Error from delete section " + err)
      }else{
        console.log("Data Deleted.")
        console.log(data)
        res.send({"Flag" : 1 ,"Message" : "Data Deleted"})
      }
    })
  });
  
  router.get('/edit/:id', function(req, res, next) {
    var id = req.params.id;
    ProductModel.findById(id,function(err,data){
      if(err){
        console.log("Error from update section " + err)
      }else{
        console.log("Data Updated.")
        console.log(data)
        res.render('product/editProduct' ,{mydata : data})
      }
    }).lean();
  });
  
  router.put('/edit/:id', function(req, res, next) {
    
    var inputData = {
        name : req.body.name,
        price : req.body.price,
        qty : req.body.qty,
        details : req.body.details
    }
    ProductModel.findByIdAndUpdate(req.params.id,inputData,function(err){
      if(err){
        console.log("Error from update section " + err)
      }else{
        console.log(req.body);
        console.log("Data Updated.")
        res.send({"Flag" : 1 ,"Message" : "Data Edited"})
      }
    })
    })


module.exports = router;