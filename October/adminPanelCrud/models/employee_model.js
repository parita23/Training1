var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    employee_name: String,
    employee_email: String,
    employee_birthdate: String,
    employee_mobile: String,
    employee_hobby: String,
    employee_isadmin: Boolean,
    employee_photo: String,
    employee_joindate: { type: Date, default: Date.now },
});

module.exports = mongoose.model('employees', myschema);;