// require('express-async-errors');
const express = require('express');
const categoriesRoute = require('./routes/categories');
const customersRoute = require('./routes/customers');
const coursesRoute = require('./routes/courses');
const enrollmentsRoute = require('./routes/enrollments');
const usersRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const errorMiddleware = require('./middleware/error');
const app = express();
const mongoose = require('mongoose');
const config = require('config');
const Logger = require('./services/logger/logger');
const logger = new Logger('vd-logs');

// process.on('warning', err => {
//     logger.error(err.message, err);
// });

logger.exceptionHandler();

process.on('unhandledRejection', ex => {
   throw ex;
});

const myPromise = Promise.reject('Another unexpected error!').then('finished');

throw new Error('Unexpected error!');

if (!config.get('jwtPrivateKey')) {
    logger.processExit(1, 'virtualdars_jwtPrivateKey not found!');
}

mongoose.connect('mongodb://localhost/virtualdars', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
    .then(() => {
        logger.info('Connected to MongoDB...');
    })
    .catch((err) => {
        logger.error('Error occured while connecting to MongoDB...', err);
    });
mongoose.set('useFindAndModify', false);
app.use(express.json());

app.use('/api/categories', categoriesRoute);
app.use('/api/customers', customersRoute);
app.use('/api/courses', coursesRoute);
app.use('/api/enrollments', enrollmentsRoute);
app.use('/api/users', usersRoute);
app.use('/api/auth', authRoute);
app.use(errorMiddleware);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    logger.info(`${port} is being listened...`);
});