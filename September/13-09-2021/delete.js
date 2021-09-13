const fs=require("fs");

fs.unlink("test1.txt",function(err){
    if(err)
    throw err;
    console.log("delete file sucessfully");
});