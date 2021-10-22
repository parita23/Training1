var express = require('express');
var router = express.Router();

//Call User Database Model
var StateModel = require('../schema/state_table');
var CountryModel = require('../schema/country_table');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/add', function(req, res, next) {

    CountryModel.find(function(err, db_category_array) {
        if (err) {
            console.log("Error in Fetch Data " + err);
          } else {
            //Print Data in Console
            console.log(db_category_array);
            //Render User Array in HTML Table
            res.render('state/add-state', { category_array : db_category_array });
            
          }
      }).lean();
  //res.render('add-category');
});


//Add Form Processing using Post Method 
router.post('/add', function(req, res, next) {
  console.log(req.body);
 
  //Create an Array 
  const mybodydata = {
    state_name: req.body.state_name,
    _country_name: req.body._country
   
    }
 
    console.log("Name is "  + req.body.state_name);
    console.log("ID is "  + req.body._country);
 
var data = StateModel(mybodydata);
 
data.save(function(err) {
    if (err) {
       console.log("Error in Insert Record");
    } else {
        res.redirect('add');
    }
})

});


 


  router.get('/display', function(req, res, next) {

    StateModel.find(function(err, db_subcategory_array){
        
        console.log(db_subcategory_array);

        if (err) res.json({message: 'There are no posts here.'});

        StateModel.find({})
        .populate('_country_name')
      
          .exec(function(err, db_subcategory_array) {

            console.log(db_subcategory_array);
         
            res.render("state/display-state", { subcategory_array: db_subcategory_array });
          })
      }).lean();
   
  });





//Delete User By ID
router.get('/delete/:id', function(req, res) {
  StateModel.findOneAndDelete(req.params.id, function(err, project) {
      if (err) {

        console.log("Error in Record Delete " + err);
          res.redirect('/displaye');
      } else {

        console.log(" Record Deleted ");
          res.redirect('/state/display');
      }
  });
});



//Get Single User for Edit Record
router.get('/edit/:id', function(req, res) {

  console.log(req.params.id);
  StateModel.findById(req.params.id , function(err,stateName){
    if(err){
      console.log("Error in get edit" , err)
    }else
    console.log(stateName)
    StateModel.find({})
    .populate('_country_name')
  
      .exec(function(err, db_subcategory_array) {

        console.log(db_subcategory_array);
     
        res.render("state/edit-state", { subcategory_array: db_subcategory_array , stateName:stateName});
      })
  })
})







//Update Record Using Post Method
router.post('/edit/:id', function(req, res) {

  console.log("Edit ID is"+ req.params.id);

  const mybodydata = {
    state_name: req.body.state_name,
    _country_name: req.body._country
  }

  StateModel.findByIdAndUpdate(req.params.id, mybodydata, function(err) {
      if (err) {
          console.log("Error in Record Update");
          res.redirect('/state/display');
      } else {
          console.log(mybodydata)
          res.redirect('/state/display');
      }
  });
});


module.exports = router;