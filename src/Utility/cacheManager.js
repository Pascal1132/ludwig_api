"use strict";

var cache;

if (process.env.ENABLE_REDIS_CACHE === 'true') {
    const redis = require('redis');
    const { promisifyAll } = require('bluebird');
    promisifyAll(redis);
    cache = redis.createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    });
    cache.on('error', function (err) {
        console.log('❌ Redis connection error :', err);
    });
    cache.connect().then((err, res) => {
        console.log('✅ Redis connected!');
    })
    setInterval(function () {
        console.log("🕒 Keeping alive - Redis");
        cache.set('ping', 'pong');
    }, 1000 * 60 * 4);
} else {
    cache = {
        data: {},
        set: async function (key, value) {
            return this.data[key] = value;
        },
        get: async function (key) {
            return this.data[key];
        }
    };
    console.log('✅ Variable based cache enabled (runtime)');
}
cache.setJson = async function (key, value) {
    return this.set(key, JSON.stringify(value));
};
cache.getJson = async function (key) {
    const value = await this.get(key);
    return value ? JSON.parse(value) : null;
};
global.cache = cache;
module.exports = cache;