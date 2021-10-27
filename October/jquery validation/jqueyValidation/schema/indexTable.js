var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    myname: String,
    myemail: String,
    password: String,
    mobile: String,
});

module.exports = mongoose.model('jqueryValidation', myschema);