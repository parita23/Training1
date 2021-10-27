var express = require('express');
var router = express.Router();
var fs = require("fs");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

// fs.readFile('views/inputfile1.txt',function(ferr,filedata){
//   if(ferr){
//     console.log(ferr);
//   }else{
//     console.log(filedata.toString());
//   }
// });
// console.log("End of the program");

// //callback hell
// function setInfo(name){
//   function address(myAddress){
//     function officeAddress(myOfficeAddress){
//       function telephoneNumber(myTelephoneNumber){
//         function emailAddress(myEmailAddress){
//           console.log("done");
//         }

//       };
//     };
//   };
// }

// //promise
// let promise = new Promise(function(resolve, reject) {
//   setTimeout(() => resolve({msg: 'To do some more job'}), 1000);
// });

// promise.then(function(result) {
//   console.log({data: 'some data'}) ;
// });

// promise.then(function(result) {
//   console.log({data: 'some other data'});
// });

// promise.then(function(result) {
//   console.log( {data: 'some more data'});
// });

//Async use

//async function
let promiseVar = new Promise(function(resolve,reject){
  setTimeout(function(){
    resolve("promise resolved")
  },5000);
});

(async function asyncFunction(){
  let result=await promiseVar;

  console.log(result);
  console.log('hello aync() called');
})();



module.exports = router;
