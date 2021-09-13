const fs=require("fs");

fs.rename("createDemo.txt","create.txt",function(err){
    if(err)
    throw err;
    console.log("rename file");
});