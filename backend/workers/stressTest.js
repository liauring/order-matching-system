require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')

;(async () => {
  try {
    rabbitmqConn = await rabbitmqConn
    rabbitmqConn.consume(
      'matchTime',
      async (matchTime) => {
        console.log(JSON.parse(matchTime.content))
        let matchTimeData = JSON.parse(matchTime.content)
        let pubRabbitmqToSub = matchTimeData[2] - matchTimeData[1]
        let rabbitmqToMatch = matchTimeData[3] - matchTimeData[2]
        // let matchToExec = matchTimeData[4] - matchTimeData[3]
        console.log(
          'pubRabbitmqToSub: ',
          pubRabbitmqToSub,
          ' / rabbitmqToMatch: ',
          rabbitmqToMatch
          // ' / matchToExec: ',
          // matchToExec
        )
        rabbitmqConn.ack(matchTime)
      },
      { noAck: false }
    )
  } catch (error) {
    console.error(error)
  }
})()
