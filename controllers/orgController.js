/**
 * Created by sumved.shami on 09/08/17.
 */
const { OK, CREATED, NOT_FOUND, NO_CONTENT } = require('http-status-codes');
const _ = require('lodash');

const logger = require('../common/logger');
const organizationDao = require('../models/organization');

const createOrganization = (req, res, next) => {
    const name = req.body.name;
    logger.info(`${req.correlationId} Creating org with name: ${name}`);
    const orgId = uuid();
    organizationDao.createOrganization({ id: orgId, name }, (error, result) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            res.status(CREATED).json({
                id: orgId
            });
        }
    });
};

const getOrganizationDetail = (req, res, next) => {
    const orgId = req.params.id;
    logger.info(`${req.correlationId} Org id: ${orgId}`);
    organizationDao.getOrganization(orgId, (error, result) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            if (result && result.length > 0) {
                const org = result[0];
                res.status(OK).json({
                    id: org.id,
                    name: org.name
                });
            } else {
                res.sendStatus(NOT_FOUND);
            }
        }
    });
};

const deleteOrganization = (req, res, next) => {
    const orgId = req.params.id;
    logger.info(`${req.correlationId} Org id: ${orgId}`);
    organizationDao.deleteOrganization(orgId, (error, result) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            if (result.affectedRows > 0) {
                res.sendStatus(NO_CONTENT);
            } else {
                res.sendStatus(NOT_FOUND);
            }
        }
    });
};

const getCampuses = (req, res, next) => {
    const orgId = req.params.id;
    logger.info(`${req.correlationId} Getting all campuses of org: ${orgId}`);
    organizationDao.getCampuses(orgId, (error, records) => {
        if (error) {
            res.locals.error = error;
            next();
        } else {
            if (records && records.length > 0) {
                const campuses = _.map(records, record => {
                    return { id: record.campus.id, name: record.campus.name, type: 'campus' };
                });
                res.status(OK).json({
                    id: orgId,
                    name: records[0].organization.name,
                    type: 'organization',
                    campuses
                });
            } else {
                res.status(OK).json({
                    id: orgId,
                    type: 'organization',
                    campuses: []
                });
            }
        }
    });
};

module.exports = {
    createOrganization,
    getOrganizationDetail,
    deleteOrganization,
    getCampuses
};
