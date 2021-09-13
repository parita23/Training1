const fs=require("fs");

fs.appendFile("createDemo.txt","hello node js",function(err){
    if(err)
    throw err;
    console.log("Append sucessfully");
});