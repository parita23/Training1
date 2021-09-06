function leapornot(){
    var year=2000;
    if(year%400==0)
    {
        console.log("It is leap year")
    }
    else if(year%100==0)
    {
        console.log("It is not leap year");
    }
    else if(year%4==0)
    {
        console.log("It is leap year");
    }
    else
    {
        console.log("It is not leap year");
    }
}
leapornot();