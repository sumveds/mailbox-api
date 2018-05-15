const _ = require('lodash');

const logger = require('../common/logger');
const emailDao = require('../models/emailDao');

const postEmail = (fields, attachment, callback) => {
    emailDao.postEmail(fields, attachment, (error, result) => {
        if (error) {
            callback(error);
        } else {
            callback(null, result);
        }
    });
};

const getReceivedEmails = (receiverId, callback) => {
    emailDao.getEmails(receiverId, (error, results) => {
        if (error) {
            callback(error);
        } else {
            const readEmails = _.filter(results, result => { return result.read === 0 });
            const unReadEmails = _.filter(results, result => { return !result.read === 0 });
            callback(null, {
                read: readEmails,
                unread: unReadEmails
            });
        }
    });
};

const getSentEmails = (senderId, callback) => {
    emailDao.getSentEmails(senderId, (error, results) => {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

const getDrafts = (senderId, callback) => {
    emailDao.getDrafts(senderId, (error, results) => {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

const getReplies = (emailId, callback) => {
    emailDao.getReplies(emailId, (error, results) => {
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

const markEmailRead = (emailId, reader, callback) => {
    emailDao.markEmailRead(emailId, reader, (error) => {
        if (error) {
            callback(error);
        } else {
            callback(null);
        }
    });
};

module.exports = {
    postEmail,
    getSentEmails,
    getDrafts,
    getReceivedEmails,
    getReplies,
    markEmailRead
};