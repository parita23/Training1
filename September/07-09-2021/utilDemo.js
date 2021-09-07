var util = require('util');
var txt = 'Congratulate %s on his %dth birthday!';
var result = util.format(txt, 'parita', 21); 

console.log(result);
