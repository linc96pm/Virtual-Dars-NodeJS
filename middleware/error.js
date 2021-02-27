// const winston = require('winston');
const Logger = require('../services/logger/logger');
const logger = new Logger('vd-logs');

module.exports = function (err, req, res, next) {
    logger.error('Unexpected server error occured', err);
    res.status(500).send('Unexpected server error occured');
}