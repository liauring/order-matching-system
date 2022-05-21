require('dotenv').config({ path: __dirname + '/./../.env' })

async function rabbitmqCreateConnect() {
  let rabbitmq = await require('amqplib').connect(
    `amqp://${process.env.rabbitmqUser}:${process.env.rabbitmqPW}@${process.env.rabbitmqHost}:${process.env.rabbitmqPort}/`
  )
  return await rabbitmq.createChannel()
}

module.exports = { rabbitmqCreateConnect }
