var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    student_name: String,
    student_email: String,
    student_gender: String,
    student_birthdate: String,
    student_mobile: String,
    student_enrollment: String,
    student_course: String
});

module.exports = mongoose.model('students', myschema);