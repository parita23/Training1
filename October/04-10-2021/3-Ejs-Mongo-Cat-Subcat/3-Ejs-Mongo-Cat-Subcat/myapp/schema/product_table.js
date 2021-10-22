var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var myschema = new Schema({
    product_name: String,
    product_price: String,
    _sub_category:
        {
          type: mongoose.Schema.Types.ObjectId, 
          ref: 'subcategory'
        }
});

module.exports = mongoose.model('product', myschema);