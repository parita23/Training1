



var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  age : Number,
  email: String,
  phno : Number,
  password : String,
  joinDate : {type : Date, default : Date.now},
  cricket:String,
     watchtv:String,
     playgame:String,
     coding:String,
     file:String
});

module.exports = mongoose.model('fileUpload',data)