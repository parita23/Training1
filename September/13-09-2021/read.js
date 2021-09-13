const fs=require("fs");

fs.readFile("demo.txt","utf-8",function(err,data){
    if(err)
    throw err;
    console.log("read sucessfully");
});