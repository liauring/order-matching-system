const { Server } = require('socket.io')
let io
let brokerConnectList = {}
function config(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    socket.on('brokerID', (brokerID) => {
      console.log('[8080 socket] user connected is ', brokerID)
      socket.brokerID = brokerID
      let roomID = brokerID
      if (!(brokerID in brokerConnectList)) {
        brokerConnectList[brokerID] = []
      }
      socket.join(roomID)
      brokerConnectList[brokerID].push(socket)
    })

    //監聽disconnecting
    socket.on('disconnecting', async (reason) => {
      try {
        let disconnectIndex = brokerConnectList[socket.brokerID].findIndex((sk) => sk.id === socket.id)
        brokerConnectList[socket.brokerID].splice(disconnectIndex, 1)
        if (brokerConnectList[socket.brokerID].length === 0) {
          delete brokerConnectList[socket.brokerID]
        }
      } catch (error) {
        console.error(error)
        return error
      }
    })
  })
}

function sendMsg(event) {
  io.emit(event)
}

function sendExec(brokerID, event) {
  io.to(brokerID).emit('execution', event)
}

function sendFiveTicks(event) {
  io.emit('fiveTicks', event)
}

function sendKLine(event) {
  io.emit('kLine', event)
}

module.exports = { config, sendMsg, sendExec, sendFiveTicks, sendKLine }
