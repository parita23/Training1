var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  details : String,
  qty : Number,
  price : Number,
  imgName : String,
  _product:
  {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'product'
  }
});

module.exports = mongoose.model('cart',data)