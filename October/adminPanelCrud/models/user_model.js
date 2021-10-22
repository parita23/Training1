var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    user_name: String,
    user_email: String,
    user_age: Number,
    user_gender: String,
    user_birthdate: String,
    user_mobile: String

});

module.exports = mongoose.model('user', myschema);