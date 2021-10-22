var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    name: String,
    email: String,
    mobile: String,
    password: String,
    pancard: String,
    aadhar: String,
    passport: String,
    gst: String,
});

module.exports = mongoose.model('formValidator', myschema);