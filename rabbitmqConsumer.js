require('dotenv').config();
let { rabbitmqConn } = require('./util/rabbitmq');
let mongodbExec = require('./util/mongodb');

(async () => {
  rabbitmqConn = await rabbitmqConn;
  rabbitmqConn.consume('saveNewOrder', async (msg) => {
    console.log(msg.content.toString());
    let insertResult = await mongodbExec(JSON.parse(msg.content))
    console.log(insertResult)
    rabbitmqConn.ack(msg);

  }, { noAck: false })
})();

// (async () => {
//   rabbitmqConn = await rabbitmqConn;
//   rabbitmqConn.consume('saveNewOrder', async (msg) => {
//     console.log(msg.content.toString());
//     let mongodbExectest = await mongodbExec();
//     console.log(mongodbExectest)
//     const insertResult = await mongodbExectest.insertMany([msg.content.toString()]);
//     console.log(insertResult)
//     rabbitmqConn.ack(msg);

//   }, { noAck: false })
// })();
