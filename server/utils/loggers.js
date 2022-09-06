const log4js = require("log4js");
log4js.configure({
    appenders: {
        loggerConsole: {type: "console"},
        loggerFile1: {type: "file", filename: "warn.log"},
        loggerFile2: {type: "file", filename: "error.log"},
        loggerFile3: {type: "file", filename: "info.log"}
    },
    categories: {
        default: { appenders: ["loggerConsole"], level: "trace"},
        info: { appenders: ["loggerConsole"], level: "info"},
        errorLog: { appenders: ["loggerConsole", "loggerFile2"], level: "error"},
        warnLog: { appenders: ["loggerFile1", "loggerConsole"], level: "warn"},
    }
})
const logWarn = log4js.getLogger('warnLog');
const logError = log4js.getLogger('errorLog');
const logInfo = log4js.getLogger('info');

module.exports = {logWarn, logError, logInfo}