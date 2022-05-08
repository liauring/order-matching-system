const { io } = require('socket.io-client')
const socketToClient = require('./util/socketToClient')
const { updateOrderInfo, createOrderHistory } = require('./server/modals/socketExecution_modal')
const { getOrderInfoSingle } = require('./server/modals/order_modal')

let socketToExchange = io('http://127.0.0.1:8080') //TODO:nginx要改

const BROKERID = 1030
socketToExchange.on('connect', () => {
  socketToExchange.emit('brokerID', BROKERID)
  console.log(`I am ${BROKERID} after emit`)
  let test = 0
  socketToExchange.on('fiveTicks', function (message) {
    // console.log("[8000 socketToExchange] fiveTicks: ", message);
    socketToClient.sendFiveTicks(message)
  })

  socketToExchange.on('execution', async function (message) {
    // console.log("[8000 socketToExchange] execution: ", message);

    try {
      await updateOrderInfo(message)
      await createOrderHistory(message)
      let result = await getOrderInfoSingle(message.orderID)
      socketToClient.sendExec(message.dealer, result[0])
    } catch (error) {
      console.error(error)
    }
  })

  socketToExchange.on('kLine', function (message) {
    // console.log('[8000 socketToExchange] kLine: ', message)
    socketToClient.sendKLine(message)
  })
})
