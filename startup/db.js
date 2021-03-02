const mongoose = require('mongoose');
const db = require('config').get('db');
const Logger = require('../services/logger/logger');
const logger = new Logger('vd-logs');

module.exports = function () {
    mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
        .then(() => {
            logger.info('Connected to MongoDB...');
        })
        .catch((err) => {
            logger.error('Error occured while connecting to MongoDB...', err);
        });
    mongoose.set('useFindAndModify', false);
}