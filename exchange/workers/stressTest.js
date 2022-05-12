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
    rabbitmqConn.prefetch(1)
    rabbitmqConn.consume(
      'matchTime',
      async (matchTime) => {
        // console.log(JSON.parse(matchTime.content))
        let matchTimeData = JSON.parse(matchTime.content)

        const timeCSVWriter = createCsvWriter({
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
        timeCSVWriter
          .writeRecords([newMatchTimeData]) // returns a promise
          .then(() => {
            // console.log(`[writeFile] is done.`)
          })

        let pubRabbitmqToSub = matchTimeData[3].pubRabbitmq - matchTimeData[1]
        let rabbitmqToMatch = matchTimeData[4].matchFinish - matchTimeData[3].pubRabbitmq
        let matchToRedis = matchTimeData[5].execFinish - matchTimeData[4].matchFinish
        let RedisToSocket = matchTimeData[6].socketEmit - matchTimeData[5].execFinish

        totalPubRabbitmqToSub += pubRabbitmqToSub
        totalrabbitmqToMatch += rabbitmqToMatch
        totalMatchToRedis += matchToRedis
        totalRedisToSocket += RedisToSocket

        let avgPubRabbitmqToSub = (totalPubRabbitmqToSub / count).toFixed(2)
        let avgRabbitmqToMatch = (totalrabbitmqToMatch / count).toFixed(2)
        let avgMatchToRedis = (totalMatchToRedis / count).toFixed(2)
        let avgRedisToSocket = (totalRedisToSocket / count).toFixed(2)
        let matchPeriodData = [
          matchTimeData[2],
          avgPubRabbitmqToSub,
          avgRabbitmqToMatch,
          avgMatchToRedis,
          avgRedisToSocket,
          count,
        ]

        const periodCSVWriter = createCsvWriter({
          header: false,
          path: 'matchLogicPeriod.csv',
          append: true,
        })
        periodCSVWriter
          .writeRecords([matchPeriodData]) // returns a promise
          .then(() => {
            // console.log(`[writeFile] is done.`)
          })

        // console.log(matchTimeData)
        console.log(matchPeriodData)

        count += 1

        rabbitmqConn.ack(matchTime)
      },
      { noAck: false }
    )
  } catch (error) {
    console.error(error)
  }
})()
