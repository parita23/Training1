



var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  ph_no : Number,
  
});

module.exports = mongoose.model('user',data)