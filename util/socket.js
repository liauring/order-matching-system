const { Server } = require('socket.io');
let io;
let brokerConnectList = {}; //知道誰正在連線，but 邏輯(暫時？)不會用到
function config(server) {
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.on('connect', async (socket) => {
    console.log(socket)
    socket.on('brokerID', async (brokerID) => {
      socket.brokerID = brokerID;
      let roomID = brokerID;
      if (!(brokerID in brokerConnectList)) {
        brokerConnectList[brokerID] = []
      }
      socket.join(roomID);
      brokerConnectList[brokerID].push(socket);
      console.log('It is brokerConnectList', brokerConnectList);
    })
  })
}

function sendMsg(event) {
  io.emit(event);
}

function sendExec(brokerID, event) {
  io.to(brokerID).emit('execution', event);
}

module.exports = { config, sendMsg, sendExec };
