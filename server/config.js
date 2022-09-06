const dotenv = require("dotenv");
const path = require("path");

dotenv.config({path: path.resolve(__dirname, 'main.env')});

module.exports = dotenv;