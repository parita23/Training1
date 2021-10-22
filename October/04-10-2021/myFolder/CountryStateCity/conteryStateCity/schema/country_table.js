var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    country_name: String
});

module.exports = mongoose.model('country', myschema);