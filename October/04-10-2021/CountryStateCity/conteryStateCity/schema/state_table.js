var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    state_name: String,
    _country_name:
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'country'
        }
      
});

module.exports = mongoose.model('state', myschema);