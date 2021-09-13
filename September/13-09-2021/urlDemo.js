var url=require("url");
var address = 'http://localhost:8080/index.php?type=page&action=update&id=5221';
var q = url.parse(address,true);

console.log(q.host);
console.log(q.pathname);
console.log(q.search);

var qdata = q.query; 
console.log(qdata.type); 
console.log(qdata.action);
console.log(qdata.id);