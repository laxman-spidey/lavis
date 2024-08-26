import {logger} from '../config/logger';

class Log {
    debug(message: string, data: any = null) {
        logger.debug(message, data);
    }
    verbose(message: string, data: any = null) {
        logger.verbose(message, data);
    }
    info(message: string, data: any = null) {
        logger.info(message, data);
    }
    warn(message: string, data: any = null) {
        logger.warn(message, data);
    }
    error(message: string, data: any = null) {
        logger.error(message, data);
    }
    db(message: string, data: any = null) {
        logger.db(message, data);
    }
}
export const log = new Log();
