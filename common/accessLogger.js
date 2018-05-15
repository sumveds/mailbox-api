/**
 * Created by sumved.shami on 29/07/17.
 */
const path = require('path');
const fs = require('fs');
const rfs = require('rotating-file-stream');
const morgan = require('morgan');

const logDirectory = path.join(__dirname, '../log');
// create a rotating write stream
const accessLogStream = rfs('access.log', {
    interval: '1d', // rotate daily
    path: logDirectory
});

const customAccessLogFormat = ':id :date[iso] :http-version :method :url :status :res[content-length] :response-time';
let accessLogger;

if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
    accessLogger = morgan(customAccessLogFormat, {stream: accessLogStream});
} else {
    accessLogger = morgan(customAccessLogFormat);
}

module.exports = accessLogger;
