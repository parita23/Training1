var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  details : String,
  qty : Number,
  price : Number,
  imgName : String
  
});

module.exports = mongoose.model('Product',data)