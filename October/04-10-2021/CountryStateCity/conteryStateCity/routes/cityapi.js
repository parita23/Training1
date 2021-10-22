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
      res.send({"Flag" : 0 , "Message" : "Error in Data Add"})
    } else {
        res.send({"Flag" : 1 , "Message" : "Data Added"})
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

        res.send({"Flag" : 1 , "Data" : city_array})
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
router.delete('/delete/:id', function (req, res) {
  CityModel.findOneAndDelete(req.params.id, function (err, project) {
    if (err) {

      console.log("Error in Record Delete " + err);
      res.send({"Flag" : 0 , "Message" : "Error in Data Delete"})
    } else {

      console.log(" Record Deleted ");
      res.send({"Flag" : 1 , "Message" : "Data Deleted"})
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
              console.log("city",city_array);
              //Render User Array in HTML Table
              return res.render('city/edit-city', { mycity: city_array, mycountry: country_array, mystate: state_array });

            }
          })
        }
      }).lean();
    }

  }).lean();
})








  //Update Record Using Post Method
  router.put('/edit/:id', function (req, res) {

    console.log("Edit ID is" + req.params.id);

    const mybodydata = {
      _country_name: req.body._country,
      _state_name: req.body._state,
      city_name: req.body.city_name
      // product_image: myfilename
    }

    CityModel.findByIdAndUpdate(req.params.id, mybodydata, function (err) {
      if (err) {
        console.log("Error in Record Update");
        res.send({"Flag" : 0 , "Message" : "Error in Data Edit"})
      } else {
console.log("my body data : ",mybodydata);
res.send({"Flag" : 1 , "Message" : "Data Updated"})
      }
    });
  });


  module.exports = router;