import mongoose from 'mongoose';
// import mongoose from 'mongoose';
// mongoose.Promise = require('bluebird');
import { get } from './db.config';

const config = get(process.env.NODE_ENV);
// mongoose.set('debug', true);

const connectWithRetry = (): ReturnType<typeof mongoose.connect> => {
  return mongoose.connect(config.database, {
    useNewUrlParser: true,
    useCreateIndex: true,
    reconnectTries: 300,
    reconnectInterval: 5000,
    autoReconnect: true,
    poolSize: 100,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    // bufferMaxEntries: 0,
    // bufferCommands: false,
    // replicaSet: 'rs0',
  }, (err: any) => {
    if (err) {
      console.error('Failed to connect to mongo on startup - retrying in 5 sec', err);
      setTimeout(connectWithRetry, 5000);
    } else {
      console.error('Connection open to ', config.database);
    }
  });
};

mongoose.connection.on('disconnect', () => {
  setTimeout(connectWithRetry, 5000);
});

connectWithRetry();
