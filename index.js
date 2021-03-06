const express = require('express');
const app = express();
const Logger = require('./services/logger/logger');
const logger = new Logger('vd-logs');

logger.exceptionHandler();
require('./startup/config');
require('./startup/db')();
require('./startup/routes')(app);
require('./startup/prod')(app);

const port = process.env.PORT || 5000;

const server = app.listen(port, () => {
    logger.info(`${port} is being listened...`);
});

module.exports = server;