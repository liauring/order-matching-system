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
  //TODO:接error
  await client.connect()
  console.log('MongoDB connected successfully to server')
})()

const db = client.db('oms')

const mongodbExec = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  try {
    const collection = db.collection('executions')
    const insertResult = await collection.insertMany([data])
    return insertResult
  } catch (error) {
    console.log(error)
  }
}

const mongodbExecArray = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  try {
    const collection = db.collection('executions')
    // data.forEach((element) => {
    //   element['_id'] = uuidv4()
    // })
    const options = { forceServerObjectId: true }

    const insertResult = await collection.insertMany(data, options)
    return insertResult
  } catch (error) {
    console.error(error)
  }
}

const mongodbClose = async function () {
  try {
    client.close()
  } catch (error) {
    console.log(error)
  }
}
module.exports = { db, mongodbExec, mongodbExecArray, mongodbClose }
