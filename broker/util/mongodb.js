const { MongoClient } = require('mongodb')

const uri = `mongodb://${process.env.mongodbUser}:${process.env.mongodbPW}@${process.env.mongodbHost}:${process.env.mongodbPort}/?maxPoolSize=20&w=majority`

const client = new MongoClient(
  uri,
  { useUnifiedTopology: true },
  { useNewUrlParser: true },
  { connectTimeoutMS: 30000 },
  { keepAlive: 1 }
)
;(async () => {
  //TODO:if error
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

module.exports = { db, mongodbExec }
