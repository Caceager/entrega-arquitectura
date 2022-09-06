const expressSession = require("express-session");
const session = expressSession({
    secret: "sisisis",
    resave: true,
    cookie: {
        maxAge: 600000, //Expira en 10 minutos
        secure: false,
        httpOnly: false,
    },
    saveUninitialized: false,
    rolling: true,
});

module.exports = session;