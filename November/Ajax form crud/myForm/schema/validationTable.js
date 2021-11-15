var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    firstName: String,
    lastName: String,
    address: String,
    gender: String,
    hobbies:String,
    city:String,
    myfile:String,

});

module.exports = mongoose.model('AjaxExcercise', myschema);