const norm = require("normalizr");
const util = require("util");

function print(objeto){
    console.log(util.inspect(objeto, false, 12, true));
}

const autorSchema = new norm.schema.Entity('autor');
const mensajeSchema = new norm.schema.Entity('mensaje', {
    autor: autorSchema,
});

const normalizado = norm.normalize(objeto, [ mensajeSchema ]);
print(normalizado.length);

const desnormalizado = norm.denormalize(normalizado.result, [ mensajeSchema ], normalizado.entities);
print(desnormalizado.length);

module.exports
