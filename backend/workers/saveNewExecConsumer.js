require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')
let { mongodbExec } = require('../util/mongodb')

;(async () => {
  try {
    rabbitmqConn = await rabbitmqConn
    rabbitmqConn.consume(
      'saveNewExec',
      async (msg) => {
        // console.log(msg.content.toString())
        console.log(JSON.parse(msg.content))
        let mongoDBInsertResult = await mongodbExec(JSON.parse(msg.content))
        console.log('[mongoDBInsertResult]: ', mongoDBInsertResult)
        rabbitmqConn.ack(msg)
      },
      { noAck: false }
    )
  } catch (error) {
    console.error(error)
  }
})()
