// var q = 'tasks';
require('dotenv').config();

let rabbitmq = require('amqplib').connect(`amqp://${process.env.rabbitmqUser}:${process.env.rabbitmqPW}@${process.env.rabbitmqHost}:${process.env.rabbitmqPort}/`);

const rabbitmqConn = rabbitmq.then(function (conn) {
  return conn.createChannel();
}).catch(console.warn);


async function rabbitmqPub(exchange, severity, message) {
  let rabbitmqConnCh = await rabbitmqConn;
  await rabbitmqConnCh.publish(exchange, severity, Buffer.from(message));
  console.log('[o] rabbitmq sent %s: %s', severity, message);
}
//外面再close connection

// rabbitmqPub('test', 'tasks', 'coco')




// Publisher
// rabbitmq.then(function (conn) {
//   return conn.createChannel();
// }).then(function (ch) {
//   return ch.assertQueue(q).then(function (ok) {
//     return ch.sendToQueue(q, Buffer.from('something to do'));
//   });
// }).catch(console.warn);



// // Consumer
// rabbitmq.then(function (conn) {
//   return conn.createChannel();
// }).then(function (ch) {
//   return ch.assertQueue(q).then(function (ok) {
//     return ch.consume(q, function (msg) {
//       if (msg !== null) {
//         console.log(msg.content.toString());
//         ch.ack(msg);
//       }
//     });
//   });
// }).catch(console.warn);

module.exports = { rabbitmqConn, rabbitmqPub };