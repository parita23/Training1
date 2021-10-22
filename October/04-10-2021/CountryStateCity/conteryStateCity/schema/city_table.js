var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    city_name : String,
    _state_name:
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'state'
        },
    _country_name : {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'country'
    }
});

module.exports = mongoose.model('city', myschema);