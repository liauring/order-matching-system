const { Server } = require('socket.io');
let io;
let brokerConnectList = {};
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



    //監聽disconnecting
    socket.on('disconnecting', async (reason) => {
      try {
        console.debug('before delete', brokerConnectList);
        console.debug(brokerConnectList[socket.brokerID]);
        console.debug(socket.id);

        let disconnectIndex = brokerConnectList[socket.brokerID].findIndex((sk) => sk.id === socket.id);

        console.debug(disconnectIndex);

        brokerConnectList[socket.brokerID].splice(disconnectIndex, 1);

        if (brokerConnectList[socket.brokerID].length === 0) {
          delete brokerConnectList[socket.brokerID];
        }
        console.debug('after delete', brokerConnectList);
      } catch (error) {
        console.error(error);
        return error;
      }
    });

  })
}

function sendMsg(event) {
  io.emit(event);
}

function sendExec(brokerID, event) {
  io.to(brokerID).emit('execution', event);
}

function sendFiveTicks(event) {
  io.emit('fiveTicks', event);
}

function sendKLine(event) {
  io.emit('kLine', event);
}

module.exports = { config, sendMsg, sendExec, sendFiveTicks, sendKLine };
