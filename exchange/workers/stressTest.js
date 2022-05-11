require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')

;(async () => {
  let totalPubRabbitmqToSub = 0
  let totalrabbitmqToMatch = 0
  let totalMatchToRabbitmq = 0
  let totalRabbitmqToSocket = 0
  let count = 0
  try {
    rabbitmqConn = await rabbitmqConn
    rabbitmqConn.consume(
      'matchTime',
      async (matchTime) => {
        // console.log(JSON.parse(matchTime.content))
        let matchTimeData = JSON.parse(matchTime.content)
        let pubRabbitmqToSub = matchTimeData[2] - matchTimeData[1]
        let rabbitmqToMatch = matchTimeData[3] - matchTimeData[2]
        let matchToRabbitmq = matchTimeData[4] - matchTimeData[3]
        let rabbitmqToSocket = matchTimeData[5] - matchTimeData[4]

        if (count === 0) {
          count += 1
          rabbitmqConn.ack(matchTime)
          return
        }

        totalPubRabbitmqToSub += pubRabbitmqToSub
        totalrabbitmqToMatch += rabbitmqToMatch
        totalMatchToRabbitmq += matchToRabbitmq
        totalRabbitmqToSocket += rabbitmqToSocket

        count += 1

        console.log(
          (totalPubRabbitmqToSub / count).toFixed(2),
          (totalrabbitmqToMatch / count).toFixed(2),
          (totalMatchToRabbitmq / count).toFixed(2),
          (totalRabbitmqToSocket / count).toFixed(2),
          count
        )
        // console.log(
        //   'pubRabbitmqToSub: ',
        //   pubRabbitmqToSub,
        //   ' / rabbitmqToMatch: ',
        //   rabbitmqToMatch
        //   // ' / matchToExec: ',
        //   // matchToExec
        // )

        rabbitmqConn.ack(matchTime)
      },
      { noAck: false }
    )
  } catch (error) {
    console.error(error)
  }
})()
