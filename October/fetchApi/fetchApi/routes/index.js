var express = require("express");
var router = express.Router();
var fetch = require("node-fetch");

var ApiModel = require("../schema/api_table");
/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

//Fetch API
router.get("/get-user", function (req, res) {
  ApiModel.find(function (err, data_user) {
    if (err) {
      res.send("data not found");
    } else {
      res.send(data_user);
    }
  });
});

router.get("/show-user", async function (req, res) {
  const response = await fetch("http://localhost:3000/get-user");
  const data = await response.json();
  res.render("showUser", { data });
});
//fetch weather api
router.get("/weather", async function (req, res) {
  const response = await fetch(
    "https://api.openweathermap.org/data/2.5/weather?q=porbandar&units=metric&APPID=fe51c92dee47c91adf48c94eeaefb343"
  );
  const data1 = await response.json();
  console.log(data1);
  res.render("weatherDisplay", { mydata: data1 });
});
//press on keypad mobile and print the name
router.get("/show", function (req, res) {
  let myArr = ["", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"];

  let inputVal = "7277744482004266287772";
  // let inputVal = "7277744482004266287772";
  var stack = [];
  var output = [];
  var separate = inputVal.split("");

  for (let storeData of separate) {
    //if condition check store data empty or not
    if (stack.length == 0) {
      stack.push(storeData);
    } else {
      //if first 0 come
      if (stack[0] == storeData) {
        stack.push(storeData);
      } else {
        //if second zero come
        if (stack[1] == 0 || stack[0] == 0) {
          if (stack[1] == 0) {
            output.push(" ");
          }
          stack = [];
          stack.push(storeData);
        } else {
          //if stack is not empty then come to here
          var keypad = myArr[stack[0] - 1].split("");
          output.push(keypad[stack.length - 1]);
          stack = [];
          stack.push(storeData);
        }
      }
    }
  }
  var keypad = myArr[stack[0] - 1].split("");
  output.push(keypad[stack.length - 1]);
  console.log(output.join(""));
});

// find single digit from multiple repitating value
router.get("/showArray",function(req,res){

var number = [1, 2, 2, 1, 2, 3,2,2]
var store = {}
var output = null;
var count=1;
// console.log("hiiiiiiiiiii",store);
for (let i = 0; i < number.length; i++) {
  // console.log("array",number[i]);
    if (store[number[i]]) {
        store[number[i]] = store[number[i]] + 1

    } else {
        store[number[i]] = 1
    }

}

for (const index of Object.keys(store)) {
  // console.log("hello",Object.keys(store));

    if (store[index] == count) {
        output = index;
        console.log(output);
    }
}
if(output == null){
console.log("not found");
}
// console.log(store);

});

//print array with last digit increment by 1

router.get('/incrementLastDigit',function(req,res){
  var num = [1,2,3];
  var test=0;
  var temp=num.join("");
 
  temp++
 
  temp = temp.toString();
 
 var temp = temp.split("");
  
//take single single value from temp array
  for(var i of temp){
    // console.log("iiii",i);
    var value=Number(i);
     num[test]=value;
     test++
    
  }
 console.log("final",num);
});
module.exports = router;
