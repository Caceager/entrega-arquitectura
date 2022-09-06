const express = require("express");
const {usuarioModel} = require("../usuarios");
const session = require("../../server/sessionStarter");
const path = require("path");
const userRouter = express.Router();
userRouter.use(express.json());

userRouter.use(session);

userRouter.get("/", (req, res)=>{
    console.log(req.session);
    if(req.session.user){
        res.render("main", {name: req.session.user.mail});
    }
    else{
        res.redirect(`/login`);
    }
});

userRouter.post("/register", async (req, res)=>{
    try {
        await usuarioModel.registro(req.body);
        res.redirect(`/usuarios/login`);
    }
    catch (err) {
        res.send(err);
    }
});

userRouter.post("/login", async (req, res) => {
    try {
        await usuarioModel.auth(req);
        res.redirect(`/`);
    }
    catch (err) {
        res.send(err);
    }
});

userRouter.get("/", (req, res) =>{
   res.send("/");
});
userRouter.get("/login", (req, res) =>{
    if(!req.session.user){
        res.sendFile(path.resolve(__dirname+"/../../public/login.html"));
    }
    else{
        res.redirect(`/`);
    }
});

userRouter.get("/register", (req, res) =>{
    if(!req.session.user){
        try {
            res.sendFile(path.resolve(__dirname + "/../../public/register.html"));
        }
        catch (e) {
            console.log(e);
        }
    }
    else{
        res.redirect(`/`);
    }
});

userRouter.post("/logout", (req, res) => {
    const name = req.session.user.mail;
    req.session.destroy();
    res.render("logout.hbs", {name, layout: false});
});

module.exports = userRouter;