var http = require('http');

var server = http.createServer(function(req, res){

  res.writeHead(200,{'content-type' : 'text/html'});
  res.end("hello world and hello npm nodemon demo  webcode company  \n");

}).listen(3000);

console.log("server running at http://127.0.0.1:3000/");