const db = 'lavis';
const IP = 'localhost'
const dbUser = 'laxmanspidey';
const dbPass = 'viviancandy';


const config: any = {
    production: {
        port: (process.env.PORT || 4134),
        adminPort: (process.env.DPORT || 4133),
        devicePort: (process.env.DPORT || 4132),
        socketPort: 4135,
        db: db,
        IP: IP,
        //agenda: 'mongodb://' + IP + '/agenda' + '?authSource=admin',
        //database: 'mongodb://' + IP + ':27017/' + db, //med testiing
        agenda: 'mongodb://' + dbUser + ':' + dbPass + '@' + IP + '/agenda' + '?authSource=admin',
        database: 'mongodb://' + dbUser + ':' + dbPass + '@' + IP + ':27017/' + db + '?authSource=admin', //med testiing
    },
    default: {
        port: (process.env.PORT || 4134),
        adminPort: (process.env.DPORT || 4133),
        devicePort: (process.env.DPORT || 4132),
        socketPort: 4135,
        db: db,
        IP: IP,
        //development 
        agenda: 'mongodb://' + IP + '/agenda' + '?authSource=admin',
        database: 'mongodb://' + IP + ':27017/' + db + '?authSource=admin', //med testiing

        //production
        // agenda: 'mongodb://' + dbUser + ':' + dbPass + '@' + IP + '/agenda' + '?authSource=admin',
        // database: 'mongodb://' + dbUser + ':' + dbPass + '@' + IP + ':27017/' + db + '?authSource=admin', //med testiing
    }
}


export const get = (env: string | undefined): any => {
    return config[env || 'default'] || config.default;
}
