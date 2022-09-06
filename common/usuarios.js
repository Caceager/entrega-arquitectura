const modeloUsuario = require("../common/mongoModels/modeloUsuario.js");
const bcrypt = require("bcryptjs");

class Usuarios {
    constructor() {
    }

    async registro(data) {
        const mail = data.username;
        const pass = data.password;
        try{
            if(await this.usernameAvailable(mail)){
                const passHash = bcrypt.hashSync(pass, bcrypt.genSaltSync(10));
                const usuarioSaveModel = new modeloUsuario({
                    mail: mail,
                    pass: passHash,
                });
                await usuarioSaveModel.save();
            }
            else{
                throw("Ya existe un usuario con ese mail.");
            }
        }
        catch (e) {
            throw(e);
        }
    }

    async auth(req) {
        const mail = req.body.username;
        const pass = req.body.password;
        try{
            const usersData = await modeloUsuario.find({mail: mail});
            const user = usersData[0];
            if(!user){
                throw "No se ha encontrado un usuario con ese email.";
            }
            else if(!bcrypt.compareSync(pass, user.pass)) {
                throw "Contraseña incorrecta";
            }
            else{
                req.session.user = user;
            }
        }
        catch (e) {
            throw(e);
        }
    }

    async usernameAvailable(username) {
        const existe = await modeloUsuario.find({mail: username});
        return(!existe[0]);
    }

    async matchPassword() {

    }
}

module.exports = { usuarioModel: new Usuarios() };