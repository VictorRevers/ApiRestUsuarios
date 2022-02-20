const { RegisterSlave } = require("mysql2/lib/commands");
const { RESERVED } = require("mysql2/lib/constants/client");
var PasswordToken = require("../models/PasswordToken");
var User = require("../models/User");


class UserController{
    async index(req, res){
       var users =  await User.findAll();
       res.json(users);
    }

    async findUserById(req, res){
        var id = req.params.id;
        var user = await User.findById(id);
        if(user == undefined){
            res.status(404);
            res.json({});
        }else{
            res.json(user);
        }
    }

    async create(req, res){
        var{email, name, password} = req.body;
        var update = false;
        var msg =  await User.validate(email, name, password, update);

        if(msg != undefined){
            res.status(400);
            res.send(msg);
            return;
       }

        var emailExists = await User.findEmail(email);

        if(emailExists){
            res.status(406);
            res.json({err: "Email já cadastrado!"});
            return;
        }

        await User.new(email, password, name);


        res.status(200);
        res.send("Pegando o corpo da requisição!");
    }


    async edit(req, res){
        var{id, name, role, email} = req.body;   
        var update = true;
        var password = undefined;

        var msg = await User.validate(email, name, password, update);

        if(msg != undefined){
            res.status(400);
            res.send(msg);
            return;
       }

       var result = await User.update(id, email, name, role);

        if(result != undefined){
            if(result.status){
                res.send("Atualizado!");
            }else{
                res.status(500);
                res.json(result.err);
            }
        }else{
            res.status(500);
            res.send("Erro no servidor!");          
        }             
    }

    async remove(req, res){
        var id = req.params.id;

        var result = await User.delete(id);

        if(result.status){
            res.send("Deletado!");
        }else{
            res.status(500);
            res.send(result.err);
        }

    }

    async recoverPassword(req, res){
        var email =  req.body.email;

        var result = await PasswordToken.create(email);

        if(result.status){
            console.log(result.token);
            res.send(`${result.token}`);
        }else{
            res.status(500);
            res.send(result.err);
        }
    }
    
    async changePassword(req,res){
        var token = req.body.token;
        var password= req.body.password;

        var isTokenValid = await PasswordToken.validate(token);

        if(isTokenValid.status){
           await User.changePassword(password, isTokenValid.token.user_id, isTokenValid.token.token, isTokenValid.token.id);
           res.send("Senha alterada!");
        }else{
            res.status(406);
            res.send("Token inválido!");
        }
       
    }    
}

module.exports = new UserController();