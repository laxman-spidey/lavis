// get the client
// const mysql = require('mysql2');

// // Create the connection pool. The pool-specific settings are the defaults
// const pool = mysql.createPool({
//   host: 'localhost',
//   user: 'root',
//   database: 'test',
//   waitForConnections: true,
//   connectionLimit: 10,
//   queueLimit: 0
// });

import * as mysql from 'mysql2/promise';
import bluebirdPromise from 'bluebird';
import config from '../config';


class mysqlConn {
    public pool: mysql.Pool;
    public constructor() {
        this.pool = mysql.createPool({
            host: config.MYSQL.HOST,
            user: config.MYSQL.USER,
            database: config.MYSQL.DB,
            password: config.MYSQL.PASSWORD,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            Promise: bluebirdPromise
        });
    }
    
}

export default new mysqlConn().pool;
