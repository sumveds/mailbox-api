/**
 * Created by sumved.shami on 29/07/17.
 */
const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const http = require('http');
const { INTERNAL_SERVER_ERROR, NOT_FOUND } = require('http-status-codes');
const expressValidator = require('express-validator');

const router = require('./router');
const logger = require('./common/logger');
const config = require('./config');

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(expressValidator());

// Import routes to be served
router(app);

// catch 404 and forward to error handler
app.use((req, res, next) => {
    // TODO: Need to do better error handling.
    const error = res.locals.error;
    if (error) {
        logger.error(`Error message: ${error.message}`);
        const errorResponse = {
            message: error.message
        };
        res.status(INTERNAL_SERVER_ERROR).send(errorResponse);
    } else {
        const err = new Error('Not Found');
        err.status = NOT_FOUND;
        next(err);
    }
});

// Error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || INTERNAL_SERVER_ERROR);
    res.json({
        message: err.message,
        error: err
    });
});

const server = http.createServer(app);
server.listen(config.port, () => logger.info(`Listening on port ${config.port}`));

module.exports = app;
