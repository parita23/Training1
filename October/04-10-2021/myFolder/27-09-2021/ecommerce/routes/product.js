var express = require('express');
var router = express.Router();

var ProductModel = require('../models/product');
var CartModel = require('../models/cart');

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
            res.redirect('/displayProduct')
        })
      })
    } else{
      res.send('<h1> File size must be 2Mb and Type of file is jpeg only allowed.</h1>')
    }
   
  });

  router.get('/displayProduct', function(req, res, next) {
    ProductModel.find(function(err,data){
        if(err) throw err;
        console.log("product data is : ",data);
        res.render('product/displayProduct' , {mydata : data})
    }).lean();

  });
  

router.get('/delete/:id', function(req, res, next) {
    var id = req.params.id;
    ProductModel.findByIdAndDelete(id,function(err,data){
      if(err){
        console.log("Error from delete section " + err)
      }else{
        console.log("Data Deleted.")
        console.log(data)
        res.redirect('/product/displayProduct')
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
    
  router.post('/edit/:id', function(req, res, next) {
    
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
        res.redirect('/product/displayProduct')
      }
    })
    })


    

// Add to cart
router.get('/cart/:id', function(req, res, next) {
  var id = req.params.id;
  ProductModel.findById(id,function(err,data){
    if(err){
      console.log("Error from update section " + err)
    }else{
      console.log("Data Added.")
      console.log("data comming from get method : ",data)
      res.render('product/addcart' ,{mydata : data})
    }
  }).lean();
});



router.post('/cart', function(req, res, next) {
  // var fileType = req.files.file.mimetype;
  // var fileSize = req.files.file.size;
  // if(fileSize <= 2*1024*1024 && (fileType == 'image/jpeg' || fileType == 'image/png') ){
  var inputData = {
      name : req.body.name,
      price : req.body.price,
      qty : req.body.qty,
      details : req.body.details,
      // imgName : req.files.file.name
  }
  console.log("my req data is : ", inputData);
  var data = CartModel(inputData);
  data.save(function(err){
      if(err) throw err;
      res.redirect('/product/displaycart');
  });


  // var fileName = req.files.file.name;

  // var fileObject = req.files.file;
  
  
  //   console.log(__dirname)
  //   fileObject.mv("public/images/" + fileName ,function(err){
  //     if(err) throw err;
  //     res.send("File Uploaded...")
  //     var data = CartModel(inputData);
  //     data.save(function(err){
  //         if(err) throw err;
  //         res.redirect('/displayProduct')
  //     })
  //   })
  //} 
  // else{
  //   res.send('<h1> File size must be 2Mb and Type of file is jpeg only allowed.</h1>')
  // }
 
});

router.get('/displaycart', function(req, res, next) {
  CartModel.find(function(err,data){
      if(err) throw err;
      console.log("Cart data is : ",data);
      res.render('product/displaycart' , {mydata : data})
  }).lean();
  // res.send("hiiiiii")

});
router.get('/remove/:id', function(req, res, next) {
  var id = req.params.id;
  CartModel.findByIdAndDelete(id,function(err,data){
    if(err){
      console.log("Error from delete section " + err)
    }else{
      console.log("Data removed.")
      console.log(data)
      res.redirect('/product/displaycart')
    }
  })
});


module.exports = router;