const { RegisterSlave } = require("mysql2/lib/commands");
const { RESERVED } = require("mysql2/lib/constants/client");
var User = require("../models/User");
var emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;

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
        
        var letrasMaiusculas = /[A-Z]/;

        if(email == undefined || email == null){
            res.status(400);
            res.json({err: "E-mail inválido!"});
            return;
        }else if(!emailRegex.test(email)){
            res.status(400);
            res.json({err: "Formato de E-mail inválido!"});
            return;
        }else if(name == undefined || name == null || name == ""){
            res.status(400);
            res.json({err: "Nome inválido!"});
            return;
        }else if(password == undefined || password == null){
            res.status(400);
            res.json({err: "Senha inválida!"});
            return;
        }else if(!letrasMaiusculas.test(password)){
            res.status(400);
            res.json({err: "Senha deve possuir ao menos uma letra maiuscula!"});
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
}

module.exports = new UserController();