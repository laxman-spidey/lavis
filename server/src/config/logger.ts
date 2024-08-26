import * as winston from 'winston';
import * as winstonDailyRotate from 'winston-daily-rotate-file';

class AppLogger {

    public logger: any = null;

    constructor() {
        // const rotateTransport = new winston.transports.DailyRotateFile({
        //     file: '~/ie-app/logs/app.log', // this path needs to be absolute
        //     colorize: false,
        //     timestamp: true,
        //     json: false,
        //     size: '100m',
        //     keep: 5,
        //     compress: true
        // });
        const levels = {db:0, error: 1, warn : 2, info: 3, verbose: 4, debug: 5}

        this.logger = winston.createLogger({
            levels,
            transports: [
                new (winston.transports.File)({
                    filename: 'logs/'+process.env.NODE_ENV+'/app.log',
                }),
                new (winston.transports.Console)({}),
                // new (winston.transports.DailyRotateFile)({
                //     filename: 'logs/'+process.env.NODE_ENV+'/app-%DATE%.log',
                //     datePattern: 'YYYY-MM-DD-HH',
                //     zippedArchive: true,
                //     maxSize: '1m',
                //     json: true,
                //     maxFiles: '14d'
                // }),
            ]
        })

        // if (process.env.NODE_ENV == "development")
        //     this.logger.add(winston.transports.Console);

        // this.logger.transports[0].query({
        //     start: 
        // })

    }



}
export const logger = new AppLogger().logger;
// export default new AppLogger().logger;

