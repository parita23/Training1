function sum(x = 3, y = 5) {
    // return sum
    return x + y;
    }
    console.log(sum(5, 15));
    console.log(sum(7)); 
    console.log(sum()); 

    console.log("by adding parameter to function");
    const sum1 = () => 15;
const calculate = function( x, y = x * sum1() ) {
return x + y;
}
const result = calculate(10);
console.log(result); 