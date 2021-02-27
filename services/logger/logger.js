const winston = require('winston')
require('winston-mongodb');
const { dateFormat, onlyDate } = require('../date/date');

var d = onlyDate();

class LoggerService {
    constructor(route) {
        this.log_data = null
        this.route = route

        const file = new winston.transports.File({
            filename: `./logs/${route}_${d}.log`
        });
        const db = new winston.transports.MongoDB({ db: 'mongodb://localhost/virtualdars-logs' });
        const logger = winston.createLogger({
            transports: [
                new winston.transports.Console(),
                file, db
            ],
            format: winston.format.printf((info) => {
                let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${route}.log | ${info.message} | `
                message = info.obj ? message + `data:${JSON.stringify(info.obj)} | ` : message
                message = this.log_data ? message + `log_data:${JSON.stringify(this.log_data)} | ` : message
                return message
            })
        });
        
        this.logger = logger
        this.processExit = function () {
            file.on('open', () => {  // wait until file._dest is ready
                // logger.info('please log me in');
                // logger.error('logging error message');
                // logger.warn('logging warning message');
                this.logger.error('virtualdars_jwtPrivateKey not found!');
                file._dest.on('finish', () => {
                    process.exit();
                });
                this.logger.end();
            });

            setTimeout(() => { }, 100); // pause the process until process.exit is call
        }

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