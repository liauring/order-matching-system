require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')
let { mongodbExec } = require('../util/mongodb')

;(async () => {
  rabbitmqConn = await rabbitmqConn
  rabbitmqConn.consume(
    'saveNewExec',
    async (msg) => {
      console.log(msg.content.toString())
      let insertResult = await mongodbExec(JSON.parse(msg.content))
      console.log(insertResult)
      rabbitmqConn.ack(msg)
    },
    { noAck: false }
  )
})()
