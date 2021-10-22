var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  password : String,
  email: String,
  phno : Number,
  address : String,
  email : String,
  dob : {type: Date, default: Date.now},
  
});

module.exports = mongoose.model('user',data)