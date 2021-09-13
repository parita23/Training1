const fs=require("fs");
var data=fs.readFileSync("test.html");
console.log("Synchronous read:"+data.toString());
console.log("program end");