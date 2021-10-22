var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  password : String,
  email: String,
});

module.exports = mongoose.model('admin',data)