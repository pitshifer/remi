const bunyan = require("bunyan");

const Logger = (name, config) => {
    let logger = bunyan.createLogger({
        name: 'main',
        level: 'debug',
        streams: [
            {
                path: '/var/log/remi/app.log',
                level: 'warn'
            }
        ]
    });

    if (config.debugMode) {
        logger.addStream({
            name: "DebugLogger",
            stream: process.stdout,
            level: 'debug'
        });
    }

    return logger;
};

exports.Logger = Logger;