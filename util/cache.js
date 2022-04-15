const redis = require('ioredis');

require('dotenv').config();

const redisClient = new redis({
  port: process.env.redisPort,
  host: process.env.redisHost,
  username: process.env.redisUser,
  password: process.env.redisPW,
  db: 0,
});


redisClient.on('error', (err) => {
  console.log('Redis Client Error', err);
  throw err;
});


module.exports = redisClient;