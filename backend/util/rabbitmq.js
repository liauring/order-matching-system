require('dotenv').config({path:__dirname + '/./../.env'});

let rabbitmq = require('amqplib').connect(`amqp://${process.env.rabbitmqUser}:${process.env.rabbitmqPW}@${process.env.rabbitmqHost}:${process.env.rabbitmqPort}/`);

const rabbitmqConn = rabbitmq.then(function (conn) {
  return conn.createChannel();
}).catch(console.warn);


async function rabbitmqPub(exchange, severity, message) {
  let rabbitmqConnCh = await rabbitmqConn;
  await rabbitmqConnCh.publish(exchange, severity, Buffer.from(message));
  // console.log('[o] rabbitmq sent %s: %s', severity, message);
}
//外面再close connection

async function rabbitmqSendToQueue(queue, message) {
  let rabbitmqConnQueue = await rabbitmqConn;
  await rabbitmqConnQueue.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { deliveryMode: true });
}

module.exports = { rabbitmqConn, rabbitmqPub, rabbitmqSendToQueue };
