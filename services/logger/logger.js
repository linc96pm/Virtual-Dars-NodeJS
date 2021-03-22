require('express-async-errors');
const winston = require('winston');
const path = require('path');
const db = require('config').get('db');
require('winston-mongodb');
const { dateFormat, onlyDate } = require('../date/date');

var d = onlyDate();

class LoggerService {
    constructor(route) {
        this.log_data = null
        this.route = route

        this.fileTransport = new winston.transports.File({
            filename: `./logs/${this.route}_${d}.log`
        });
        this.consoleTransport = new winston.transports.Console();
        this.dbTransport = new winston.transports.MongoDB({
            db: 'mongodb://localhost:27017/virtualdars',
            collection: 'logs'
        });
        const logger = winston.createLogger({
            transports: [this.consoleTransport, this.fileTransport, this.dbTransport],
            format: winston.format.combine(
                winston.format((info) => {
                    info.level = info.level.toUpperCase();
                    return info;
                })(),
                winston.format.colorize(),
                winston.format.label({ label: path.basename(require.main.filename) }),
                winston.format.splat(),
                winston.format.prettyPrint(),
                // winston.format.json(),
                winston.format.printf((info) => {
                    let message = `${dateFormat()} | ${info.level} | [${info.label}] | ${info.message}| `;
                    message = info.obj
                        ? message + `data:${JSON.stringify(info.obj)} | `
                        : message;
                    message = this.log_data
                        ? message + `log_data:${JSON.stringify(this.log_data)} | `
                        : message;
                    return message;
                })
            ),
        });

        this.logger = logger;
        this.processExit = function (code, message) {
            this.fileTransport.on('open', () => {  // wait until file._dest is ready
                logger.info('please log me in');
                // logger.error('logging error message');
                // logger.warn('logging warning message');
                this.logger.error(message);
                this.fileTransport._dest.on('finish', () => {
                    process.exit(code);
                });
                this.logger.end();
            });

            setTimeout(() => { }, 100); // pause the process until process.exit is call
        }
    }

    exceptionHandler() {
        winston.exceptions.handle([this.consoleTransport, this.fileTransport]);
        process.on('unhandledRejection', ex => {
            throw ex.message;
        });
    }

    setLogData(log_data) {
        this.log_data = log_data
    }
    async info(message) {
        this.logger.log('info', message);
    }
    async info(message, obj) {
        this.logger.log('info', message, {
            obj
        })
    }
    async debug(message) {
        this.logger.log('debug', message);
    }
    async debug(message, obj) {
        this.logger.log('debug', message, {
            obj
        })
    }
    async error(message) {
        this.logger.log('error', message);
    }
    async error(message, obj) {
        this.logger.log('error', message, {
            obj
        })
    }
}
module.exports = LoggerService