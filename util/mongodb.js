const { MongoClient } = require('mongodb');

const url = `mongodb://${process.env.mongodbUser}:${process.env.mongodbPW}@${process.env.mongodbHost}:${process.env.mongodbPort}/?maxPoolSize=20&w=majority`;

const client = new MongoClient(url);
(async () => {
  await client.connect();
  console.log("MongoDB connected successfully to server");
})();

const mongodbExec = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = client.db('oms').collection('executions')
  const insertResult = await collection.insertMany([data]);
  return insertResult
};

const mongodbNewOrder = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = client.db('oms').collection('LogsOfNewOrder')
  const insertResult = await collection.insertOne(data);
  return insertResult
};

const mongodbUpdateOrder = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = client.db('oms').collection('LogsOfUpdateOrder')
  const insertResult = await collection.insertOne(data);
  return insertResult
};


module.exports = { mongodbExec, mongodbNewOrder, mongodbUpdateOrder };
