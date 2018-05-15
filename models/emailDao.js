const async = require('async');
const _ = require('lodash');

const logger = require('../common/logger');
const { pool } = require('../common/database');

const postEmail = (fields, attachment, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            connection.beginTransaction(error => {
                if (error) {
                    callback(error);
                } else {
                    async.waterfall([
                        (callback) => {
                            connection.query('insert into email set ?', {
                                content: fields.content,
                                from_user_id: fields.sender_id,
                                status: fields.status
                            }, (error, result) => {
                                if (error) {
                                    callback(error);
                                } else {
                                    logger.info(`Result: ${JSON.stringify(result, null, 2)}`);
                                    callback(null, result.insertId);
                                }
                            });
                        },
                        (emailId, callback) => {
                            const params = [];
                            const receivers = JSON.parse(fields.receiver_id);
                            _.forEach(receivers, receiver => {
                                params.push({
                                    email_id: emailId,
                                    user_id: receiver
                                });
                            });
                            connection.query('insert into email_to set ?', params, (error, result) => {
                                if (error) {
                                    callback(error);
                                } else {
                                    logger.info(`Result: ${JSON.stringify(result, null, 2)}`);
                                    callback(null, emailId);
                                }
                            });
                        },
                        (emailId, callback) => {
                            logger.info(`Attachment: ${JSON.stringify(attachment)}`);
                            connection.query('insert into attachment set email_id = ?, file = char(?)',
                                [emailId, attachment.buffer.data], (error, result) => {
                                if (error) {
                                    callback(error);
                                } else {
                                    logger.info(`Result: ${JSON.stringify(result, null, 2)}`);
                                    callback(null, emailId);
                                }
                            });
                        }
                    ], (error, result) => {
                        if (error) {
                            return connection.rollback(() => {
                                connection.release();
                                callback(error);
                            });
                        }
                        connection.commit(error => {
                            if (error) {
                                return connection.rollback(() => {
                                    connection.release();
                                    callback(error);
                                });
                            }
                            connection.release();
                            callback(null, {
                                id: result
                            });
                        });
                    });
                }
            });
        }
    });
};

const getEmails = (receiverId, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            const query = 'select e.id, e.content, e.sent_at, ' +
                'u.email, u.first_name, u.last_name, eto.read from email_to eto ' +
                'join email e on e.id = eto.email_id ' +
                'join user u on u.id = e.from_user_id ' +
                'where eto.user_id = ?';
            connection.query(query, [receiverId], (error, results) => {
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

const getReplies = (emailId, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            const query = 'select e.id as email_id, e.content, e.status, e.sent_at, ' +
                'u.id, u.first_name, u.last_name, u.email ' +
                'from email_reply er ' +
                'join email e on e.id = er.reply_email_id ' +
                'join user u on e.from_user_id = u.id ' +
                'where er.parent_email_id = ?';
            connection.query(query, [emailId], (error, results) => {
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

const getSentEmails = (userId, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            const query = 'select e.id as email_id, e.content, e.status, e.sent_at, ' +
                'u.id, u.first_name, u.last_name, u.email ' +
                'from email e ' +
                'join email_to et on e.id = et.email_id ' +
                'join user u on u.id = et.user_id ' +
                'where e.from_user_id = ? and e.status = ?';
            connection.query(query, [userId, 'sent'], (error, results) => {
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

const getDrafts = (userId, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            const query = 'select e.id as email_id, e.content, e.status, e.sent_at, ' +
                'u.id, u.first_name, u.last_name, u.email ' +
                'from email e ' +
                'join email_to et on e.id = et.email_id ' +
                'join user u on u.id = et.user_id ' +
                'where e.from_user_id = ? and e.status = ?';
            connection.query(query, [userId, 'draft'], (error, results) => {
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

const markEmailRead = (emailId, reader, callback) => {
    pool.getConnection((error, connection) => {
        if (error) {
            callback(error);
        } else {
            const query = 'update email_to set read = ? where email_id = ? and user_id = ?';
            connection.query(query, [1, emailId, reader], (error, results) => {
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
    postEmail,
    getEmails,
    getReplies,
    getSentEmails,
    getDrafts,
    markEmailRead
};
