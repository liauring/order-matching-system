const { io } = require('socket.io-client')
const socketToClient = require('./util/socketToClient')
const { updateOrderInfo, createOrderHistory } = require('./server/modals/socketExecution_modal')

let socketToExchange = io('http://127.0.0.1:8080') //TODO:nginx要改

const BROKERID = 1030
socketToExchange.on('connect', () => {
  socketToExchange.emit('brokerID', BROKERID)
  console.log(`I am ${BROKERID} after emit`)
})

socketToExchange.on('fiveTicks', function (message) {
  socketToClient.sendFiveTicks(message)
})

socketToExchange.on('execution', async function (message) {
  console.log('[socketToExchange] execution: ', message)
  await updateOrderInfo(message)
  await createOrderHistory(message)
  socketToClient.sendExec(message.dealer, message)
})

socketToExchange.on('kLine', function (kLineInfo) {
  socketToClient.sendKLine(kLineInfo)
})
