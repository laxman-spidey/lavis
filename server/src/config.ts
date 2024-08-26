const env: string = process.env.NODE_ENV ? process.env.NODE_ENV : "development";

const original = Object.freeze({
  PORT: 3000,
  MYSQL: {
    HOST: "localhost",
    DB: "stonefactory",
    USER: "stonefactory",
    PASSWORD: "stone123#"
  },
  REDIS: {
    HOST: "redis",
    PORT: "6379",
    PASSWORD: "redispass"
  },
  JWT_SECRET: 'sdtcb',
  // GOOGLE: {
  //   CLIENT_ID: '165514553949-l3n5tqkmo1lg7sosig81169blhiohsbv.apps.googleusercontent.com',
  //   CLIENT_SECRET: '4COw4h3DalwuaNruWbtMQHQx',
  //   REDIRECT_URI: 'https://api.lrnio.com/auth/google/callback',
  //   SCOPE: ['https://www.googleapis.com/auth/userinfo.profile','https://www.googleapis.com/auth/gmail.readonly']
  // },
  LOG_LOCATION: 'logs/' + env + '/app.log',
});

const development = {
  ...original,
  PORT: 3000,
};

const test = {
  ...original,
  MYSQL: {
    ...original.MYSQL,
    HOST: "localhost"
  }
}

const production = {
  ...original
}

const config: { [key: string]: any } = {
  "development": development,
  "test": test,
  "production": production
}

export default config[env];