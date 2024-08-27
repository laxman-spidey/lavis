import * as redisLib from "redis";
import { promisify } from "util";

import config from "@app/config";
class Redis {
    private redisClient: redisLib.RedisClient;
    private asyncGet: Function;
    private asyncSet: Function;
    constructor() {
        this.redisClient = redisLib.createClient({
            host: config.REDIS.HOST,
            port: config.REDIS.PORT,
            password: config.REDIS.PASSWORD,
            retry_strategy: function (options) {
                if (options.error && options.error.code === "ECONNREFUSED") {
                    // End reconnecting on a specific error and flush all commands with
                    // a individual error
                    return new Error("The server refused the connection");
                }
                if (options.total_retry_time > 1000 * 60 * 60) {
                    // End reconnecting after a specific timeout and flush all commands
                    // with a individual error
                    return new Error("Retry time exhausted");
                }
                if (options.attempt > 10) {
                    // End reconnecting with built in error
                    return undefined;
                }
                // reconnect after
                return Math.min(options.attempt * 100, 3000);
            },
            
        });
        this.asyncGet = promisify(this.redisClient.get).bind(this.redisClient);
        this.asyncSet = promisify(this.redisClient.set).bind(this.redisClient);
    }
    public async get(key: string): Promise<any> {
        return await this.asyncGet(key);
    }
    public async set(key: string, value: any): Promise<any> {
        return await this.asyncSet(key, value);
    }
    public getRedisClient() {
        return this.redisClient;
    }
}
const redisInstance = new Redis() 
export default redisInstance;

// console.log("-----------------------------it's all about redis now ----------------");
// await redisInstance.set('somekey','somevalue');
// const value = await redisInstance.get('somekey');
// console.log(value);
