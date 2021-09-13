var path = require('path');
var filename = path.basename('/Users/Refsnes/demo_path.js');
console.log(filename);
//normlize
var x = path.normalize('Users/Refsnes/../Jackson');
console.log(x);
//join
var y = path.join('Users', 'Refsnes', 'demo_path.js');
console.log(y);
//file extension
var ext = path.extname('/Users/Refsnes/demo_path.js');
console.log(ext);
//directory name
var directories = path.dirname('/Users/Refsnes/demo_path.js');
console.log(directories);
//format
var obj = { dir: 'C:\\Users\\Refsnes', base: 'demo_path.js' }
//Format the path object into a path string:
var p = path.format(obj);
console.log(p);