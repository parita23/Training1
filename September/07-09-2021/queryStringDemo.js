var queryString=require('querystring');
var q=queryString.parse('year=2017&month=february');
console.log(q.year);
console.log(q.month);