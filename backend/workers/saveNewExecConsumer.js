require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')
let { mongodbExec } = require('../util/mongodb')

;(async () => {
  try {
    rabbitmqConn = await rabbitmqConn
    rabbitmqConn.consume(
      'saveNewExec',
      async (msg) => {
        // console.log(JSON.parse(msg.content))
        await mongodbExec(JSON.parse(msg.content))
        rabbitmqConn.ack(msg)
      },
      { noAck: false }
    )
  } catch (error) {
    console.error(error)
  }
})()
