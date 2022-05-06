const redis = require('ioredis')

require('dotenv').config({ path: __dirname + '/./../.env' })

const redisClient = new redis({
  port: process.env.redisPort,
  host: process.env.redisHost,
  username: process.env.redisUser,
  password: process.env.redisPW,
})

console.log('Redis connects successfully.')

redisClient.on('connect', async () => {
  console.log('connect', redisClient.connector)
})

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err)
  throw err
})

module.exports = redisClient
