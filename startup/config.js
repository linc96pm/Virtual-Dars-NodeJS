const config = require('config');
const Logger = require('../services/logger/logger');
const logger = new Logger('vd-logs');

module.exports = (function () {
    if (!config.get('jwtPrivateKey')) {
        logger.error('virtualdars_jwtPrivateKey not found!', 'exiting the process', (() => {
            logger.processExit(1, 'Calling process exit')
        })()
        );
    }
}())