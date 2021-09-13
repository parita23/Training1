const querystring=require("querystring");
var data=querystring.parse('name=parita&company=webcodegenie');
console.log(data);

// json to string
const qs1=querystring.stringify({name:'parita',company:'webcodegenie'});
console.log(qs1); 