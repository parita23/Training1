var fs=require("fs");

fs.writeFile("createDemo.txt","hello world",function(err){
    if(err)
    throw err;
    console.log("file created successfully");
});