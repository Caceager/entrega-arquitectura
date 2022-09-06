const cluster = require('cluster');
const numerocpus = require('os').cpus().length;
const processId = process.pid;
console.log(`Proceso: ${processId}. IsMaster: ${cluster.isMaster}`);
const compression = require ('compression');
const express = require('express');
const http = require('http');
const mongoose = require("mongoose");
const session = require ('./server/sessionStarter');
const { engine } = require('express-handlebars');
const cookieParser = require("cookie-parser");
const minimist = require("minimist");

const userRouter = require("./common/controllers/usuarioController.js");
const { logError, logWarn, logInfo } = require("./server/utils/loggers.js");
const randomRouter = require("./common/controllers/randomController");
const argumentos = minimist(process.argv, {alias: {'p': 'port', 'm' : 'mode'} } );
const setSocket = require("./common/sockets/socket.js");
const clusterMode = argumentos.mode === 'cluster';
const port = argumentos.port || process.env.PORT;

if(!clusterMode) console.log("#################\nIniciando en modo Fork\n#################")

if(cluster.isMaster && clusterMode){
    console.log("#################\nIniciando en modo Cluster\n#################")
    process.env.CLUSTER = "TRUE";
    for (let i = 0; i < numerocpus; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker) => {
        console.log(`Closed process ${worker.process.id}`);
    })
}
else{
    async function ConectarMongo() {
        logInfo.info('Iniciando conexion a mongodb');
        try{
            await mongoose.connect('mongodb+srv://agustinMongoCH:mongoCH@cluster0.fwdkeuy.mongodb.net/?retryWrites=true&w=majority', {
                useNewUrlParser: true
            });
            logInfo.info('Conexion a mongodb completada.');
        }
        catch(err){
            logInfo.info(err);
        }
    }
    ConectarMongo();

    const app = express();
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    const server = http.createServer(app);
    setSocket(server);

    app.use('/usuarios', userRouter);
    app.use('/api/randoms', randomRouter);
    app.use(cookieParser());
    app.use(express.static('public'));
    app.use(session);
    app.use((error, req, res, next) =>{
        switch (error.message) {
            case "Ya existe un usuario con ese mail.":
                res.send("Ya existe un usuario con ese maail");
                break
            case "Usuario no encontrado.":
                res.send("Usuario no encontrado.")
                break
            case "Error de autenticación.":
                res.send("Error de autenticación.")
                break;
        }
    });

    const routeLogger = (req, res, next) => {
        const log = `Visitada la ruta ${req.url} con el metodo ${req.method}`;
        logInfo.info(log);
        next();
    }

    app.engine(
        "hbs",
        engine({
            extname: ".hbs",
            layoutsDir: __dirname+"/views",
        })
    );
    app.set("view engine", "hbs");
    app.set("views", "./views");

    app.get("/", (req, res)=>{
        if(req.session.user){
            logInfo.info("Se ha conectado "+req.session.user.mail);
            res.render("main", {name: req.session.user.mail});
        }
        else{
            res.redirect(`/login`);
        }
    });

    app.get("/login", routeLogger, (req, res) =>{
        res.redirect("/usuarios/login");
    });

    app.get("/register", routeLogger, (req, res) =>{
        res.redirect("/usuarios/register");
    });

    app.get("/info", routeLogger, compression(), (req, res) => {
        const betterArgs = {...argumentos};
        delete betterArgs._;
        const result = JSON.stringify({
            "Argumentos de entrada": betterArgs,
            "Plataforma": process.platform,
            "Version de Node": process.version,
            "Uso de memoria": process.memoryUsage(),
            "Id del proceso": process.pid,
            "Path de ejecucion": process.execPath,
            "Carpeta del proyecto": process.cwd(),
            "Numero de cpus usadas": clusterMode ? numerocpus : 1,
        }, null, 2);
        res.header("Content-Type",'application/json');
        res.send(result);
    });

    app.get('/*', (req, res) => {
        logWarn.warn("Se ha visitado una ruta incorrecta: " + req.url);
        res.redirect('/');
    });

    server.listen(port, ()=>{
        logInfo.info(`Server started on port ${port}`);
    });
}
