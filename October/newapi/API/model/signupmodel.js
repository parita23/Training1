//3.call mongoose  & add schema
var mongoose =require('mongoose');

var Schema =mongoose.Schema;
var myschema =new Schema({
    name:String,
    address:String,
    email:String,
    password:String,
    contact:String,
});

module.exports=mongoose.model('signup',myschema);