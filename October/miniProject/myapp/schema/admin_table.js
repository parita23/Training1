var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    name: String,
    email: String,
    birthdate: String,
    mobile: String,
    password:String,
    joindate: { type: Date, default: Date.now },

});

module.exports = mongoose.model('admin', myschema);