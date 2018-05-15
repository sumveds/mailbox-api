const logger = require('../common/logger');
const { pool } = require('../common/database');

const createUser = (user, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            connection.query('insert into user set ?', user, (error, results) => {
                connection.release();
                if (error) {
                    callback(error);
                } else {
                    logger.info(`Result: ${JSON.stringify(results, null, 2)}`);
                    callback(null, results);
                }
            });
        }
    });
};

const getUserByEmail = (email, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            connection.query('select password from user where email = ?', [email], (error, results) => {
                connection.release();
                if (error) {
                    callback(error);
                } else {
                    logger.info(`Result: ${JSON.stringify(results, null, 2)}`);
                    callback(null, results);
                }
            });
        }
    });
};

module.exports = {
    createUser,
    getUserByEmail
};
