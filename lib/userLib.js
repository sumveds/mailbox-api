const bcrypt = require('bcrypt');

const config = require('../config');
const logger = require('../common/logger');
const userDao = require('../models/userDao');

const createUser = (user, callback) => {
    user.password = bcrypt.hashSync(user.password, config.salt_rounds);
    userDao.createUser(user, (error, result) => {
        if (error) {
            callback(error);
        } else {
            callback(null, {
                id: result.insertId
            });
        }
    });
};

const login = (credential, callback) => {
    userDao.getUserByEmail(credential.email, (error, results) => {
        if (error) {
            callback(error);
        } else {
            if (results && results.length > 0) {
                const hash = results[0].password;
                if (bcrypt.compareSync(credential.password, hash)) {
                    callback(null);
                } else {
                    callback(new Error('Password mismatch'));
                }
            } else {
                callback(new Error('User not found'));
            }
        }
    });
};

module.exports = {
    createUser,
    login
};
