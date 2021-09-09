const arrValue = ['My', 'name', 'is', 'parita'];
console.log(arrValue); 
console.log(...arrValue); 

console.log("clone array using spread operator");

let arr1 = [ 1, 2, 3];
let arr2 = arr1;
console.log(arr1); 
console.log(arr2); 

arr1.push(4);
console.log(arr1); 
console.log(arr2);

console.log("rest parameter using spread operator");

let func = function(...args) {
    console.log(args);
    }
    func(3); 
    func(4, 5, 6); 