var express = require('express');
var router = express.Router();

//Call User Database Model
var SubCategoryModel = require('../schema/sub_category_table');
var CategoryModel = require('../schema/category_table');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {

    CategoryModel.find(function(err, db_category_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_category_array);
            //Render User Array in HTML Table
            res.render('subcategory/add-subcategory', { category_array : db_category_array });
            
          }
      }).lean();
  //res.render('add-category');
});


//Add Form Processing using Post Method 
router.post('/add', function(req, res, next) {
  console.log(req.body);
 
  //Create an Array 
  const mybodydata = {
    sub_category_name: req.body.sub_category_name,
    _category: req.body._category
   
    }
 
    console.log("Name is "  + req.body.sub_category_name);
    console.log("ID is "  + req.body._category);
 
var data = SubCategoryModel(mybodydata);
 
data.save(function(err) {
    if (err) {
       console.log("Error in Insert Record");
       res.send({"Flag" : 0 , "Message" : "Data is not added."})
    } else {
        res.send({"Flag" : 1 , "Message" : "Data is added."})
    }
})

});


 


  router.get('/display', function(req, res, next) {

    SubCategoryModel.find(function(err, db_subcategory_array){
        
        console.log(db_subcategory_array);

        if (err){ res.json({message: 'There are no posts here.'});

    }else{
            console.log(db_subcategory_array);
         
            res.send({"Flag" : 1 , "Data" : db_subcategory_array})
    }
          })
      })
   



//Get Single User By ID
router.get('/show/:id', function(req, res) {
  console.log(req.params.id);

  SubCategoryModel.findById(req.params.id, function(err, db_sucategory_array) {


      if (err) {
          console.log("Error in Single Record Fetch" + err);
      } else {

        
          console.log(db_sucategory_array);

          res.send({"Flag" : 1 , "Data" : db_category_array})
      }
  });
});



//Delete User By ID
router.delete('/delete/:id', function(req, res) {
  SubCategoryModel.findByIdAndDelete(req.params.id, function(err, project) {
    console.log(project)
      if (err) {

        console.log("Error in Record Delete " + err);
        res.send({"Flag" : 0 , "Message" : "Data is not added."})
      } else {

        console.log(" Record Deleted ");
        res.send({"Flag" : 1 , "Message" : "Data is Deleted."})
      }
  });
});



//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {

  console.log(req.params.id);
  
  SubCategoryModel.findById(req.params.id, function(err, db_subcategory_array) {
    if (err) {
        console.log("Edit Fetch Error " + err);
    } else {
        console.log(db_subcategory_array);

        res.render('subcategory/edit-subcateogry-form', { subcategory_array: db_subcategory_array });
    }
}).lean();
});








//Update Record Using Post Method
router.put('/edit/:id', function(req, res) {

  console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    sub_category_name: req.body.sub_category_name,
    _category: req.body._category
  }

  SubCategoryModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.send({"Flag" : 0 , "Message" : "Data is not edited."})
      } else {
        
        res.send({"Flag" : 1 , "Message" : "Data is Edited."})
      }
  });
});


module.exports = router;