/**
 * Created by sumved.shami on 29/07/17.
 */
const winston = require("winston");

const level = process.env.LOG_LEVEL || 'debug';

const logger = new winston.Logger({
    transports: [
        new winston.transports.Console({
            level: level,
            json: false,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        }),
        // new winston.transports.File({ filename: 'api.log' }),
        new winston.transports.File({
            filename: 'api_error.log',
            level: 'error',
            json: false,
            timestamp: function () {
                return (new Date()).toISOString();
            }
        })
    ]
});

module.exports = logger;
