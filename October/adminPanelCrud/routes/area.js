var express = require('express');
var router = express.Router();

//Call User Database Model
var AreaModel = require('../schema/area_table');
var CityModel = require('../schema/city_table');
var StateModel = require('../schema/state_table');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {

    CityModel.find(function(err, db_city_array){
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_city_array);
            StateModel.find(function(err,db_state_array) {
                if(err){
                    console.log(err)
                }else{
                    //Render User Array in HTML Table
                    res.render('area/add-area', { city_array : db_city_array, state_array : db_state_array });
                }
            }).lean();
          }
      }).lean();
});


//Add Form Processing using Post Method 
router.post('/add', function(req, res, next) {
  console.log(req.body);
 
  //Create an Array 
  const mybodydata = {
    area_name: req.body.area_name,
    _city: req.body._city,
    _state: req.body._state
   
    }
 
    console.log("Name is "  + req.body.area_name);
    console.log("ID is "  + req.body._city);
    console.log("ID is "  + req.body._state);
 
var data = AreaModel(mybodydata);
 
data.save(function(err) {
    if (err) {
       console.log("Error in Insert Record");
    } else {
        res.redirect('add');
    }
})

});
  router.get('/display', function(req, res, next) {
    AreaModel.find(function(err, db_area_array){
        console.log(db_area_array);
        if (err) res.json({message: 'There are no posts here.'});

        AreaModel.find({}).lean()
          .populate('_city')
          .populate('_state')
          .exec(function(err, db_area_array) {
            console.log(db_area_array);
            console.log("convertttt data")
           console.log(JSON.stringify(db_area_array));
           var area_array_store = (JSON.stringify(db_area_array));
            res.render("area/display-area", { mydata: db_area_array, area_store: area_array_store });
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
          res.render('subcategory/single-subcategory-record', { subcategory_array: db_sucategory_array });
      }
  });
});



//Delete User By ID
router.get('/delete/:id', function(req, res) {
  AreaModel.findByIdAndDelete(req.params.id, function(err, project) {
      if (err) {
        console.log("Error in Record Delete " + err);
          res.redirect('/display');
      } else {
        console.log("Record Deleted ");
          res.redirect('/area/display');
      }
  });
});

//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {
  console.log(req.params.id);
  AreaModel.findById(req.params.id, function(err, db_area_array) {
      if (err) {
          console.log("Edit Fetch Error " + err);
      } else {
          console.log(db_area_array);
          StateModel.find(function(err,db_state_array) {
                if(err){
                    console.log(err)
                }else{
                    //Render User Array in HTML Table
                    res.render('area/edit-area', { mydata : db_area_array, state_array : db_state_array });
                }
            }).lean();
      }
  }).lean();
});

//Update Record Using Post Method
router.post('/edit/:id', function(req, res) {

  console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    area_name: req.body.area_name,
    _city: req.body._city,
    _state: req.body._state

  }

  AreaModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/area/display');
      } else {
          res.redirect('/area/display');
      }
  });
});

module.exports = router;