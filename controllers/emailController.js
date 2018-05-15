const { OK, CREATED, NO_CONTENT } = require('http-status-codes');

const logger = require('../common/logger');
const emailLib = require('../lib/emailLib');

const postEmail = (req, res, next) => {
    const fields = req.body;
    const attachment = req.file;
    emailLib.postEmail(fields, attachment, (error, result) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(CREATED).json(result);
        }
    });
};

const getDrafts = (req, res, next) => {
    const senderId = req.query.drafter;
    emailLib.getDrafts(senderId, (error, results) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(OK).json(results);
        }
    });
};

const getReceivedEmails = (req, res, next) => {
    const receiverId = req.query.receiver;
    emailLib.getReceivedEmails(receiverId, (error, results) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(OK).json(results);
        }
    });
};

const getSentEmails = (req, res, next) => {
    const senderId = req.query.sender;
    emailLib.getSentEmails(senderId, (error, results) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(OK).json(results);
        }
    });
};

const getReplies = (req, res, next) => {
    const emailId = req.params.id;
    emailLib.getReplies(emailId, (error, results) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(OK).json(results);
        }
    });
};

const markEmailRead = (req, res, next) => {
    const emailId = req.body.email_id;
    const reader = req.body.reader;
    emailLib.markEmailRead(emailId, reader, (error, results) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.sendStatus(NO_CONTENT);
        }
    });
};

module.exports = {
    postEmail,
    getDrafts,
    getReceivedEmails,
    getSentEmails,
    getReplies,
    markEmailRead
};
