type Environment = "development" | "test" | "production";

const env: Environment = process.env.NODE_ENV ? process.env.NODE_ENV as Environment : "development" as Environment;


const original = Object.freeze({
  HOST: "localhost",
  PORT: 3000,
  MONGO: {
    URL: 'mongodb://localhost:27017',
    DB: 'lavis'
  },
  REDIS: {
    HOST: "redis",
    PORT: "6379",
    PASSWORD: "redispass"
  },
  JWT_SECRET: 'sdtcb',
  LOG_LOCATION: 'logs/' + env + '/app.log',
} as const );

type Config = typeof original;
const development: Config = {
  ...original,
  PORT: 3000,
};

const test : Config = {
  ...original,  
}

type ConfigOut = {
  [key in Environment]: Config
}

const production: Config = {
  ...original
}

const config: ConfigOut = {
  "development": development,
  "test": test,
  "production": production
}

export default config[env];