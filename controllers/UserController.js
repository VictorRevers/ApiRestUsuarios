class UserController{
    async index(req, res){}

    async create(req, res){
        var{email, name, password} = req.body;
        var emailRegex = /^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/i;
        var letrasMaiusculas = /[A-Z]/;

        if(email == undefined || email == null){
            res.status(400);
            res.json({err: "E-mail inválido!"});
        }else if(!emailRegex.test(email)){
            res.status(400);
            res.json({err: "Formato de E-mail inválido!"});
        }else if(name == undefined || name == null || name == ""){
            res.status(400);
            res.json({err: "Nome inválido!"});
        }else if(password == undefined || password == null){
            res.status(400);
            res.json({err: "Senha inválida!"});
        }else if(!letrasMaiusculas.test(password)){
            res.status(400);
            res.json({err: "Senha deve possuir ao menos uma letra maiuscula!"});
        }



        res.status(200);
        res.send("Pegando o corpo da requisição!");
    }
}

module.exports = new UserController();