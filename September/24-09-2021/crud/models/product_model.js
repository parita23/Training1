var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema1 = new Schema({
    product_name : String,
    product_code : Number,
    product_price: Number
});

module.exports = mongoose.model('product',myschema1);