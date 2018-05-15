const { CREATED, NO_CONTENT } = require('http-status-codes');

const logger = require('../common/logger');
const userLib = require('../lib/userLib');

const createUser = (req, res, next) => {
    const user = req.body;
    userLib.createUser(user, (error, user) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(CREATED).json(user);
        }
    });
};

const login = (req, res, next) => {
    const credential = req.body;
    userLib.login(credential, (error) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.sendStatus(NO_CONTENT);
        }
    })
};

module.exports = {
    createUser,
    login
};
