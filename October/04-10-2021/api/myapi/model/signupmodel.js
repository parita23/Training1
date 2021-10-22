//3.call mongoose  & add schema
var mongoose =require('mongoose');

var Schema =mongoose.Schema;
var myschema =new Schema({
    email:String,
    password:String,
});

module.exports=mongoose.model('signUp',myschema);