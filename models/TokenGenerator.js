class TokenGenerator{
     
    async token(){
        var numbers = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
        var letters = ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","U","V","W","X","Y","Z"];

        Array.prototype.getRandom = (arr) => {
            return arr[Math.floor((Math.random() * arr.length))];
        }
        
        var token = "";
        for(var i = 0; i < 4; i++){
            if(i % 2 == 0){
                token += numbers.getRandom(numbers);
            }else{
                token += letters.getRandom(letters);
            }
        }
        console.log(token);
        
        return token;
        
    }
}

module.exports = new TokenGenerator();