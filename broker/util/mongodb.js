const { MongoClient } = require('mongodb')

const url = `mongodb://${process.env.mongodbUser}:${process.env.mongodbPW}@${process.env.mongodbHost}:${process.env.mongodbPort}/?maxPoolSize=20&w=majority`

const client = new MongoClient(url)

;(async () => {
  //TODO:接error
  await client.connect()
  console.log('MongoDB connected successfully to server')
})()

const db = client.db('oms')

const mongodbExec = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = db.collection('executions')
  const insertResult = await collection.insertMany([data])
  return insertResult
}

// const mongodbGetOrderHistory = async function (dealerAccount, time) {
//   let midnight = new Date(new Date(time).setHours(0, 0, 0, 0)).getTime();
//   const collection = db.collection('logsOfNewOrder')
//   const historyOrder = await .find({ $and: [{ account: { $eq: dealerAccount } }, { executionTime: { $gte: midnight } }] })
// }

module.exports = { db, mongodbExec }
