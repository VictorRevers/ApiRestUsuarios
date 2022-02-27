var knex = require("../database/connection");
var bcrypt = require("bcrypt");
const PasswordToken = require("./PasswordToken");

class User{

    async validate(email, name, password, update){
       try{
        var emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
        var letrasMaiusculas = /[A-Z]/;
        var msg = undefined;

        if(!update){
            if(email == undefined || email == null){
                msg = "E-mail inválido!";  
                return msg; 
            }
            else if(name == undefined || name == null || name == ""){              
                msg = "Nome inválido!";
                return msg;
            }else if(password == undefined || password == null){
                msg = "Senha inválida!";
                return msg;
            }
        }
       
        if(email != null || email !=undefined){
            if(!emailRegex.test(email)){
                msg = "Formato de E-mail inválido!"
                return msg;
            }
        }

        if(password != null || password !=undefined){
            if(!letrasMaiusculas.test(password)){
                msg = "Senha deve possuir ao menos uma letra maiuscula!"
                return msg;
            }
        }
         
        return msg;

       }catch(err){
           console.log(err);
           msg = undefined;
           return msg;
       }
    }

    async validatePassword(){

    }

    async checkPassword(){
        
    }


    async findAll(){
        try{
            var result = await knex.select(["id", "name", "email", "role"]).table("users");
            return result;
        }catch(err){
            console.log(err);
            return [];
        }       
    }

    async findById(id){

        try{
            var result = await knex.select(["id", "name", "email", "role"]).table("users").where('id', id);

            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            } 
        }catch(err){
            console.log(err);
            return undefined;
        }       
    }

    async findByEmail(email){
        try{
            var result = await knex.select(["id", "name", "password","email", "role"]).table("users").where('email', email);

            if(result.length > 0){
                return result[0];
            }else{
                return undefined;
            } 
        }catch(err){
            console.log(err);
            return undefined;
        }
    }

  
    async new(email, password, name){     
        
       try{
            var hash = await bcrypt.hash(password, 10);

            await knex.insert({email, password: hash, name, role: 0}).table("users");

       }catch(err){
           console.log(err);
       }
    }

    async findEmail(email){
        try{
           var result =  await knex.select("*").from("users").where({email: email});

           if(result.length > 0){
               return true;
           }else{
               return false;
           }
            
        }catch(err){
            console.log(err);
            return false;
        }
        
    }

    async update(id, email, name, role){
        var user =await this.findById(id);

        if(user != undefined){
            var editUser =  {};

            if(email != undefined){
                if(email != user.email){
                    var result = await this.findEmail(email);
                    if(!result){
                        editUser.email = email;
                    }                    
                }else{
                    return {status: false, err: "Email já cadastrado!"}
                }                
            }

            if(name != undefined){
                editUser.name = name;
            }

            if(role != undefined){
                editUser.role = role;
            }

           try{
            await knex.update(editUser).table('users').where('id',id);
            return {status:true}
           }catch(err){
            return {status:false, err: err}
           }

        }else{
            return {status: false, err: "Usuário não existe!"}
        }
    }

    async delete(id){
        var user = await this.findById(id);
        if(user != undefined){
            try{
                await knex.delete().table("users").where('id', id);
                return {status: true}
            }catch(err){
                return {status: false, err: err}
            }
        }else{
            return {status: false, err: "Usuário não encontrado!"}
        }
    }

    async changePassword(newPassword, id, token, tokenId){
        var hash = await bcrypt.hash(newPassword, 10);
        await knex.update('password', hash).where('id', id).table("users");
        await knex.update('used', 1).where('id', tokenId).table("passwordtokens");
        //await PasswordToken.setUsed(tokenId); 
    }
}

module.exports = new User();