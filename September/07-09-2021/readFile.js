var http=require('http');
var fs=require('fs');

http.createServer(function(req,res){
    fs.readFile('demoFile1.html',function(err,data){
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        return res.end();
    });
}).listen(3000);
console.log("server running at http://localhost:3000/");