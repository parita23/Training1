function swap(){
    var a = 10;
    var b = 20;

   console.log("Value of a before swap is"+a+"<br>");
    console.log("Value of b before swap is"+b+"<br>");
    var temp;


    temp = a;
    a = b;
    b = temp;

console.log("After swap value of a is: ");
console.log(a);
console.log("After swap value of b ");
console.log(b);

}
swap();