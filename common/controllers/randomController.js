const express = require('express');
const compression = require ('compression');
const url = require("url");
const {logInfo} = require("../../server/utils/loggers");
const {fork} = require("child_process");
const path = require("path");
const randomRouter = express.Router();

const clusterMode = process.env.CLUSTER || undefined;

randomRouter.get("/", compression(), (req, res) => {
    const num = url.parse(req.url, true).query.cant || 100000000;
    if (!clusterMode) {
        logInfo.info("Ejecutando /randoms con fork.");
        const forked = fork(path.resolve(__dirname + "/../../utils/randomsFork.js"));
        forked.on('message', msg =>{
            res.header("Content-Type",'application/json');
            const resultado = msg.result;
            res.send(JSON.stringify({CANTIDAD_NUMEROS: num, resultado}, null, 2));
        })

        forked.send(num);
    }
    else {
        logInfo.info("Ejecutando /randoms sin fork.");
        const result = {};
        for(let i = 0; i < num; i++){
            const num = Math.floor(Math.random() * 1000) + 1;
            const cant = result[num] ? result[num] + 1 : 1;
            result[num] = cant;
        }
        res.header("Content-Type",'application/json');
        const resultJson = JSON.stringify(result, null, 2);
        res.send(resultJson);
    }
});

module.exports = randomRouter;