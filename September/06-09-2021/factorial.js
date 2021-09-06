function factorial(){
    var num=5;
    
            var fact = 1;
            if (num == 0 || num == 1){
            return fact;
            }else{
            for(var i = num; i >= 1; i--){
            fact = fact * i;
            }
            console.log(fact);
            }  
        }
        factorial();
