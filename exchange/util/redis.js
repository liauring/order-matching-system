const redis = require('ioredis')

require('dotenv').config({ path: __dirname + '/./../.env' })

const redisClient = new redis({
  port: process.env.redisPort,
  host: process.env.redisHost,
  username: process.env.redisUser,
  password: process.env.redisPW,
})

redisClient.on('connect', async () => {
  console.log('Redis connect')
})

redisClient.on('error', (err) => {
  console.log('Redis Client Error', err)
  throw err
})

module.exports = redisClient
