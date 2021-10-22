



var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  en_no : Number,
  email: String,
  ph_no : Number,
  dept : String
  
});

module.exports = mongoose.model('student',data)