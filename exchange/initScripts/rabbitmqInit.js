require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')

;(async () => {
  //create exchange and queues for matchNewOrder
  try {
    rabbitmqConn = await rabbitmqConn
    await rabbitmqConn.assertExchange('matchNewOrder', 'direct', {
      durable: false,
    })
    for (let i = 0; i < 5; i++) {
      await rabbitmqConn.assertQueue(`matchNewOrder-stock-${i}`)
      await rabbitmqConn.bindQueue(`matchNewOrder-stock-${i}`, 'matchNewOrder', `${i}`)
      console.log(i)
    }

    await rabbitmqConn.assertQueue('saveNewExec')
    await rabbitmqConn.assertQueue('matchTime')

    rabbitmqConn.close()
    process.exit(0)
  } catch (error) {
    console.error(error)
  }
})()