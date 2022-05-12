require('dotenv').config({ path: __dirname + '/./../.env' })
let { rabbitmqConn } = require('../util/rabbitmq')
const createCsvWriter = require('csv-writer').createArrayCsvWriter

;(async () => {
  let totalPubRabbitmqToSub = 0
  let totalrabbitmqToMatch = 0
  let totalMatchToRedis = 0
  let totalRedisToSocket = 0
  let count = 1
  try {
    rabbitmqConn = await rabbitmqConn
    rabbitmqConn.consume(
      'matchTime',
      async (matchTime) => {
        // console.log(JSON.parse(matchTime.content))
        let matchTimeData = JSON.parse(matchTime.content)

        const csvWriter = createCsvWriter({
          header: false,
          path: 'matchLogicTime.csv',
          append: true,
        })
        let newMatchTimeData = matchTimeData.reduce((acc, cur, index) => {
          if (index === 0 || index === 1) {
            acc.push(cur)
          } else {
            time = Object.values(cur)
            acc.push(time)
          }
          return acc
        }, [])
        csvWriter
          .writeRecords([newMatchTimeData]) // returns a promise
          .then(() => {
            // console.log(`[writeFile] is done.`)
          })

        let pubRabbitmqToSub = matchTimeData[2].pubRabbitmq - matchTimeData[1]
        let rabbitmqToMatch = matchTimeData[3].matchFinish - matchTimeData[2].pubRabbitmq
        let matchToRedis = matchTimeData[4].execFinish - matchTimeData[3].matchFinish
        let RedisToSocket = matchTimeData[5].socketEmit - matchTimeData[4].execFinish

        totalPubRabbitmqToSub += pubRabbitmqToSub
        totalrabbitmqToMatch += rabbitmqToMatch
        totalMatchToRedis += matchToRedis
        totalRedisToSocket += RedisToSocket

        // console.log(matchTimeData)
        console.log(
          (totalPubRabbitmqToSub / count).toFixed(2),
          (totalrabbitmqToMatch / count).toFixed(2),
          (totalMatchToRedis / count).toFixed(2),
          (totalRedisToSocket / count).toFixed(2),
          count
        )

        count += 1

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
