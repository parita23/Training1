



var mongoose = require('mongoose')
const Schema  = mongoose.Schema;

const data = new Schema({
  name : String,
  gender: { type: String,
    enum: "Male"||"Female" 
    },
  email: String,
  phno : Number,
  password : String
  
});

module.exports = mongoose.model('login',data)