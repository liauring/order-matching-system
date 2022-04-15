// var q = 'tasks';
require('dotenv').config();


const rabbitmqconn = rabbitmq.then(function (conn) {
  return conn.createChannel();
}).catch(console.warn);


async function rabbitmqPub(exchange, severity, message) {
  let rabbitmqconnCh = await rabbitmqconn;
  await rabbitmqconnCh.publish(exchange, severity, Buffer.from(message));
  console.log('[o] Sent %s: %s', severity, message);
}

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

module.exports = rabbitmqPub