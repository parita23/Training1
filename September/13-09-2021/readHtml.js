const fs=require("fs");
const http=require("http");
http.createServer(function(req,res){
    fs.readFile("test.html",function(err,data){
        res.writeHead(200,{'content-type' : 'text/html'});
        res.write(data);
        res.end();
    });
}).listen(5000);
console.log("server started ");