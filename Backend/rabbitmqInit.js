require('dotenv').config();
let { rabbitmqConn } = require('./util/rabbitmq');

(async () => {
  //create exchange and queues for matchNewOrder
  rabbitmqConn = await rabbitmqConn;
  await rabbitmqConn.assertExchange('matchNewOrder', 'direct', {
    durable: false
  });
  for (let i = 0; i < 5; i++) {
    await rabbitmqConn.assertQueue(`matchNewOrder-stock-${i}`)
    await rabbitmqConn.bindQueue(`matchNewOrder-stock-${i}`, 'matchNewOrder', `${i}`);
    console.log(i)
  }

  //create queue for saveOrderLogs and saveNewExec
  await rabbitmqConn.assertQueue('saveOrderLog')
  await rabbitmqConn.assertQueue('saveNewExec')

  rabbitmqConn.close();
  process.exit(0);
})();



