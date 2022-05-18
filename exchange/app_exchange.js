require('dotenv').config({ path: __dirname + '/./.env' })
const express = require('express')
const app = express()
const cors = require('cors')
const http = require('http')
const server = http.createServer(app)

require('./util/socket.js').config(server)
require('./workers/redisSub.js')
require('./util/rabbitmq').rabbitmqCreateConnect
// message []
// [2022-05-08 13:41:31.123][type] message

app.use(cors())
app.use(express.static(__dirname + '/public'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use('/api/', [
  require('./server/routes/fiveTicks_route'),
  require('./server/routes/kLine_route'),
  require('./server/routes/newOrder_route'),
  require('./server/routes/order_route'),
])

app.use(function (req, res, next) {
  res.status(404).send('The page is not found!')
})

app.use(function (err, req, res, next) {
  console.error(err)
  res.status(500).send('Internal Server Error')
})

server.listen(process.env.port, async () => {
  console.log(`Listening on port: ${process.env.port}`)
})

module.exports = app
