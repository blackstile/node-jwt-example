const jwt =  require('jsonwebtoken');
const express = require("express");
const bodyParser = require('body-parser');
const app  =  express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

app.get("/api", (req, res)=>{
    res.json({
        "message": "It's OK!"     
    });
});

app.post("/api/login", (req, res)=>{
    let user = {
        name: "william",
        email: "blackstile@hotmail.com",
        perfil: "admin"
    }
    let login = req.body.login
    let senha = req.body.senha
    console.log(login)
    console.log(senha)
    if (login == "william" && senha=="miranda"){
        let token = jwt.sign(user, "12345miranda", {expiresIn: "1h"})
        res.setHeader("Authorization", "Bearer "+ token)
        res.json({
            user,
            token
        })
    }else{
        res.status(401)
        res.json({
            message: "Login ou senha inválidos!"
        })
    }
})

app.get('/api/protected', verifyAuth,(req,res)=>{
    console.log('req.token', req.token)    
    jwt.verify(req.token, '12345miranda', (err, data)=>{
        if (err){
            res.status(403);
            res.json({
                message: "Token inválido!"
            })
        }
    });
    res.json({
        message: "This is JWT protected API"
    })
});

function verifyAuth(req, res, next){
    let token = req.header('authorization')
    if (token){
        req.token =  token.split(' ')[1]
    }else{
        res.status(401)
        res.json({
            message: "Usuário não autenticado!"
        })
    }
    next();    
}
app.listen(3000, ()=> console.log("Starting server on port 3000"));