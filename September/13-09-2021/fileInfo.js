var fs=require("fs");
fs.stat("create.txt",function(err,stats){
if(err)
{
    return console.error(err);
}
console.log(stats);
console.log("isFile?"+stats.isFile());
console.log("isDirectory"+stats.isDirectory());
});