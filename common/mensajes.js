const modeloMensajes = require("./mongoModels/modeloMensajes");
const norm = require("normalizr");

const autorSchema = new norm.schema.Entity('autor');
const mensajeSchema = new norm.schema.Entity('mensaje', {
    autor: autorSchema,
});

class Mensajes{
    constructor(){
    }

    async guardar_mensajes(mensaje){
        const mensajeSaveModel = new modeloMensajes(mensaje);
        console.log(mensajeSaveModel);
        await mensajeSaveModel.save();
    }

    async cargar_mensajes(){
        const mensajes = await modeloMensajes.find({});
        const normalizado = norm.normalize(mensajes, [ mensajeSchema ]);

        return normalizado;
    }
}



module.exports = {mensajes: Mensajes};