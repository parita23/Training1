



var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  age : Number,
  email: String,
  phno : Number,
  password : String
  
});

module.exports = mongoose.model('user',data)