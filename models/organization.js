const logger = require('../common/logger');
const { pool } = require('../common/database');

const getCampusesSql = 'select organization.id, organization.name, campus.id, campus.name from campus ' +
    'left join organization on campus.organization_id = organization.id ' +
    'where campus.organization_id = ?';

const createOrganization = (organization, callback) => {
    pool.getConnection((err, connection) => {
        connection.query('INSERT INTO organization SET ?', organization, (error, results) => {
            connection.release();
            if (error) {
                callback(error);
            } else {
                logger.info(`Result: ${JSON.stringify(results, null, 2)}`);
                callback(null, results);
            }
        });
    });
};

const getOrganization = (orgId, callback) => {
    pool.getConnection((error, connection) => {
        connection.query('SELECT * FROM organization WHERE id = ?', orgId, (error, results) => {
            logger.info(`Result: ${JSON.stringify(results, null, 2)}`);
            connection.release();
            if (error) {
                callback(error);
            } else {
                callback(null, results);
            }
        });
    });
};

const getCampuses = (orgId, callback) => {
    pool.getConnection((error, connection) => {
        getCampusList(connection, orgId, callback);
    });
};

const getCampusList = (connection, orgId, callback) => {
    const options = { sql: getCampusesSql, nestTables: true };
    connection.query(options, orgId, (error, results) => {
        logger.info(`Result: ${JSON.stringify(results, null, 2)}`);
        connection.release();
        if (error) {
            callback(error);
        } else {
            callback(null, results);
        }
    });
};

const deleteOrganization = (orgId, callback) => {
    pool.getConnection((error, connection) => {
        connection.query('DELETE FROM organization WHERE id = ?', orgId, (error, results) => {
            logger.info(`Result: ${JSON.stringify(results, null, 2)}`);
            connection.release();
            if (error) {
                callback(error);
            } else {
                callback(null, results);
            }
        });
    });
};

module.exports = {
    createOrganization,
    getOrganization,
    getCampuses,
    deleteOrganization
};
