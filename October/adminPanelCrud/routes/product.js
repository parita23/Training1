var express = require('express');
var router = express.Router();

//Call User Database Model
var ProductModel = require('../schema/product_table');
var SubCategoryModel = require('../schema/sub_category_table');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {

    SubCategoryModel.find(function(err, db_product_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log("product array");
            console.log(db_product_array);
            //Render User Array in HTML Table
            res.render('product/add-product', { product_array : db_product_array });
          }
      }).lean();
});

//Add Form Processing using Post Method 
router.post('/add', function(req, res, next) {
  console.log(req.body);
    var fileobject = req.files.product_Image;
    var filename = req.files.product_Image.name;
  //Create an Array 
  const mybodydata = {
    product_name: req.body.product_name,
     product_price: req.body.product_price,
      product_Image: filename,
    _subcategory: req.body._subcategory
    }
    console.log("Name is "  + req.body.product_name);
    console.log("Name is "  + req.body.product_Image);
    console.log("ID is "  + req.body._subcategory);
 
var data = ProductModel(mybodydata);
 
data.save(function(err) {
    if (err) {
       console.log("Error in Insert Record");
    } else {
         fileobject.mv("public/productUploads/" + filename, function(err) {
                    if (err) throw err;
                    // res.send("File Uploaded");
                  res.redirect('add');
         });
    }
})
});
  router.get('/display', function(req, res, next) {
    ProductModel.find(function(err, db_product_array){
        console.log(db_product_array);
        if (err) res.json({message: 'There are no posts here.'});

        ProductModel.find({}).lean()
        .populate('_subcategory')
          .exec(function(err, db_product_array) {
            console.log(db_product_array);
            res.render("product/display-product", { mydata: db_product_array });
          })
      });
  });

//Get Single User By ID
router.get('/show/:id', function(req, res) {
  console.log(req.params.id);

  SubCategoryModel.findById(req.params.id, function(err, db_sucategory_array) {
      if (err) {
          console.log("Error in Single Record Fetch" + err);
      } else {  
          console.log(db_sucategory_array);
          res.render('product/single-subcategory-record', { subcategory_array: db_sucategory_array });
      }
  });
});

//Delete User By ID
router.get('/delete/:id', function(req, res) {
  ProductModel.findByIdAndDelete(req.params.id, function(err, project) {
      if (err) {
        console.log("Error in Record Delete " + err);
          res.redirect('/display');
      } else {
        console.log("Record Deleted ");
          res.redirect('/product/display');
      }
  });
});

//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {
  console.log(req.params.id);
  ProductModel.findById(req.params.id, function(err, db_product_array) {
      if (err) {
          console.log("Edit Fetch Error " + err);
      } else {
          console.log(db_product_array);
          res.render('product/edit-product', { product_array: db_product_array });
      }
  }).lean();
});

//Update Record Using Post Method
router.post('/edit/:id', function(req, res) {
  console.log("Edit ID is"+ req.params.id);
   var fileobject = req.files.product_Image;
    var filename = req.files.product_Image.name;

  const mybodydata = {
    product_name: req.body.product_name,
     product_price: req.body.product_price,
      product_Image: filename,
    _subcategory: req.body._subcategory
  }

  ProductModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/product/display');
      } else {
            fileobject.mv("public/productUploads/" + filename, function(err) {
                    if (err) throw err;
                    // res.send("File Uploaded");
                res.redirect('/product/display');
         });
      }
  });
});

module.exports = router;