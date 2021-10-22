var express = require('express');
var router = express.Router();
const fileUpload = require('express-fileupload');

//Call User Database Model
var CityModel = require('../schema/city_table');
var StateModel = require('../schema/state_table');
var CountryModel = require('../schema/country_table');

/* GET home page. */

router.get('/add', function (req, res, next) {

  StateModel.find(function (err, state_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      //Print Data in Console
      console.log(state_array);

      CountryModel.find(function (err, country_array) {
        if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          //Print Data in Console
          console.log(country_array);
          //Render User Array in HTML Table
          return res.render('city/add-city', { mycountry: country_array, mystate: state_array });


        }
      });
    }
  }).lean();

});



//Add Form Processing using Post Method 
router.post('/add', function (req, res, next) {
  console.log(req.body.product_name);


  //Create an Array 
  const mybodydata = {
    city_name: req.body.city_name,
    _state_name: req.body._state,
    _country_name: req.body._country



  }
  console.log(mybodydata)
  var data = CityModel(mybodydata);

  data.save(function (err) {
    if (err) {
      console.log("Error in Insert Record");
    } else {
      res.redirect('city/add');
    }
  })

});




router.get('/display', function (req, res, next) {

  CityModel.find(function (err, city_array) {

    console.log(city_array);

    if (err) res.json({ message: 'There are no posts here.' });

    CityModel.find({})
      .populate('_state_name _country_name')

      .exec(function (err, city_array) {

        console.log(city_array);

        res.render("city/display-city", { city_array: city_array });
      })
  }).lean();

});




//Get Single User By ID
router.get('/show/:id', function (req, res) {
  console.log(req.params.id);
  CityModel.findById(req.params.id, function (err, db_product_array) {

    if (err) {
      console.log("Error in Single Record Fetch" + err);
    } else {
      console.log(db_product_array);
      res.render('product/single-product-record', { product_array: db_product_array });
    }
  });
});



//Delete User By ID
router.get('/delete/:id', function (req, res) {
  CityModel.findOneAndDelete(req.params.id, function (err, project) {
    if (err) {

      console.log("Error in Record Delete " + err);
      res.redirect('/product/display');
    } else {

      console.log(" Record Deleted ");
      res.redirect('/city/display');
    }
  });
});



//Get Single User for Edit Record
router.get('/edit/:id', function (req, res) {

  console.log(req.params.id);
  CityModel.findById(req.params.id, function (err, city_array) {
    if (err) {
      console.log("Error in Fetch Data " + err);
    } else {
      console.log(city_array)
        StateModel.find(function (err, state_array) {
        if (err) {
          console.log("Error in Fetch Data " + err);
        } else {
          //Print Data in Console
          console.log(state_array);

          CountryModel.find(function (err, country_array) {
            if (err) {
              console.log("Error in Fetch Data " + err);
            } else {
              //Print Data in Console
              console.log(country_array);
              //Render User Array in HTML Table
              return res.render('city/add-city', { mycity: city_array, mycountry: country_array, mystate: state_array });


            }
          });
        }
      })
    }

  }).lean();;
})








  //Update Record Using Post Method
  router.post('/edit/:id', function (req, res) {

    console.log("Edit ID is" + req.params.id);

    const mybodydata = {
      _country: req.body._country,
      _state: req.body._state,
      city_name: req.body.city_name
      // product_image: myfilename
    }

    CityModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
      if (err) {
        console.log("Error in Record Update");
        res.redirect('/city/display');
      } else {

        res.redirect('/city/display');
      }
    });
  });


  module.exports = router;