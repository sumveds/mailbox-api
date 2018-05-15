const config = require('../config');
const logger = require('../common/logger');

const mysql = require('mysql');
const pool  = mysql.createPool(config.mysql);

pool.on('connection', connection => {
    logger.info(`Connection thread: ${connection.threadId} connecting...`);
});

pool.on('release', connection => {
    logger.info(`Connection thread: ${connection.threadId} releasing...`);
});

/*pool.end( error => {
    // all connections in the pool have ended
    if (error) {
        logger.error(`Error while ending pools before server shutdown: ${error.message}`);
    } else {
        logger.info('Ending database connections pool...');
    }
});*/

module.exports = {
    pool
};
