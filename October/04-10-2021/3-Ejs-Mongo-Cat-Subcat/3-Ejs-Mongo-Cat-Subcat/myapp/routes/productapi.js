var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');

//Call User Database Model
var ProductModel = require('../schema/product_table');
var SubCategoryModel = require('../schema/sub_category_table');

/* GET home page. */

router.get('/add', function(req, res, next) {
  SubCategoryModel.find(function(err, db_sub_category_array) {
    if (err) {
        console.log("Error in Fetch Data " + err);
      } else {
        //Print Data in Console
        console.log(db_sub_category_array);
        //Render User Array in HTML Table
        res.render('product/add-product', {sub_category_array : db_sub_category_array });
        
      }
  }).lean();
});


//Add Form Processing using Post Method 
router.post('/add', function(req, res, next) {
  console.log(req.body.product_name);
  console.log(req.body.product_price);

 

  //Create an Array 
  const mybodydata = {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    _sub_category : req.body._sub_category,
    
   
}
console.log(mybodydata)
var data = ProductModel(mybodydata);
 
data.save(function(err) {
    if (err) {
       console.log("Error in Insert Record");
    } else {
        res.send({"Flag" : 1 , "Message" : " Data is added"})
    }
})

});




router.get('/display', function(req, res, next) {

  ProductModel.find(function(err, db_subcategory_array){
        
    console.log(db_subcategory_array);

    if (err) res.json({message: 'There are no posts here.'});

    ProductModel.find({})
    .populate('_sub_category')
  
      .exec(function(err, db_subcategory_array) {

        console.log(db_subcategory_array);
     
        res.send({"Flag" : 1 , "Data" : db_subcategory_array})
      })
  }).lean();
 
});




//Get Single User By ID
router.get('/show/:id', function(req, res) {
  console.log(req.params.id);
  ProductModel.findById(req.params.id, function(err, db_product_array) {

      if (err) {
          console.log("Error in Single Record Fetch" + err);
      } else {
          console.log(db_product_array);
          res.send({"Flag" : 1 , "Data" : db_product_array});
      }
  });
});



//Delete User By ID
router.delete('/delete/:id', function(req, res) {
    ProductModel.findByIdAndDelete(req.params.id, function(err, project) {
      if (err) {

        console.log("Error in Record Delete " + err);
        res.send({"Flag" : 1 , "Message" : " Data is not deleted"})
      } else {

        console.log(" Record Deleted ");
        res.send({"Flag" : 1 , "Message" : " Data is Dleted"})
      }
  });
});



//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {

  console.log(req.params.id);
  
  ProductModel.findById(req.params.id, function(err, db_subcategory_array) {
    if (err) {
        console.log("Edit Fetch Error " + err);
    } else {
        console.log(db_subcategory_array);

        res.render('product/edit-product', { product_array: db_subcategory_array });
    }
}).lean();
})







//Update Record Using Post Method
router.put('/edit/:id', function(req, res) {

  console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    product_name: req.body.product_name,
    product_price: req.body.product_price,
    // product_image: myfilename
  }

  ProductModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.send({"Flag" : 1 , "Message" : " Data is not edited"})
      } else {
        
        res.send({"Flag" : 1 , "Message" : " Data is Edited"})
      }
  });
});


module.exports = router;