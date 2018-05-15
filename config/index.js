const _ = require('lodash');
const defaults = require('./default');

// const config = require("./" + (process.env.NODE_ENV || 'development') + '.js');
const config = require(`./${(process.env.NODE_ENV || 'development')}.js`);

module.exports = _.merge({}, defaults, config);
