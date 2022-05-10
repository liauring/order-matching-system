// require('dotenv').config({ path: __dirname + '/./../.env' })
// const CONSUMEQUEUE = 'matchTime'
// let { rabbitmqConn } = require('../util/rabbitmq')(async () => {
//   rabbitmqConn = await rabbitmqConn
//   rabbitmqConn.prefetch(1)
//   rabbitmqConn.consume(
//     CONSUMEQUEUE,
//     async (newOrder) => {
//       console.log(newOrder)
//     },
//     { noAck: false }
//   )
// })()
