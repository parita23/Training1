const fs=require("fs");

fs.open("demo.txt","w",function(err,file){
    if(err)
    throw err;
    console.log("file open in write mode");
});