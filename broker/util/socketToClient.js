const { Server } = require('socket.io')
let io
let clientConnectList = {}
function config(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  })

  io.on('connection', (socket) => {
    console.log('user connected')
    socket.on('clientID', (clientID) => {
      socket.clientID = clientID
      let roomID = clientID
      if (!(clientID in clientConnectList)) {
        clientConnectList[clientID] = []
      }
      socket.join(roomID)
      console.log(io.sockets.adapter.rooms)
      clientConnectList[clientID].push(socket)
    })

    //監聽disconnecting
    // socket.on('disconnecting', async (reason) => {
    //   try {
    //     let disconnectIndex = clientConnectList[socket.clientID].findIndex((sk) => sk.id === socket.id);
    //     clientConnectList[socket.clientID].splice(disconnectIndex, 1);
    //     if (clientConnectList[socket.clientID].length === 0) {
    //       delete clientConnectList[socket.clientID];
    //     }
    //   } catch (error) {
    //     console.error(error);
    //     return error;
    //   }
    // });
  })
}

function sendMsg(event) {
  io.emit(event)
}

function sendExec(clientID, event) {
  console.log('----------------------')
  console.log(io.sockets.adapter.rooms)
  io.to(clientID).emit('execution', event)
}

function sendFiveTicks(event) {
  io.emit('fiveTicks', event)
}

function sendKLine(event) {
  io.emit('kLine', event)
}

module.exports = { config, sendMsg, sendExec, sendFiveTicks, sendKLine }
