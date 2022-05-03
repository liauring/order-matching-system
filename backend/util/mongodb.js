const { MongoClient } = require('mongodb');

const url = `mongodb://${process.env.mongodbUser}:${process.env.mongodbPW}@${process.env.mongodbHost}:${process.env.mongodbPort}/?maxPoolSize=20&w=majority`;

const client = new MongoClient(url);
let db;
(async () => {
  await client.connect();
  db = client.db('oms');
  console.log("MongoDB connected successfully to server");
})();

const mongodbExec = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = db.collection('executions')
  const insertResult = await collection.insertMany([data]);
  return insertResult;
};

const mongodbNewOrder = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = db.collection('logsOfNewOrder')
  const insertResult = await collection.insertOne(data);
  return insertResult;
};

const mongodbUpdateOrder = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = db.collection('logsOfUpdateOrder')
  const insertResult = await collection.insertOne(data);
  return insertResult;
};

const mongodbGetExecutionHistory = async function (symbol, time) {
  let midnight = new Date(new Date(time).setHours(0, 0, 0, 0)).getTime();
  const collection = db.collection('executions')
  const executionHistory = await collection.find({ $and: [{ symbol: { $eq: symbol } }, { executionTime: { $gte: midnight } }] }).project({ symbol: 1, price: 1, executionTime: 1, _id: 0 }).toArray();
  return executionHistory;
}

// const mongodbGetOrderHistory = async function (dealerAccount, time) {
//   let midnight = new Date(new Date(time).setHours(0, 0, 0, 0)).getTime();
//   const collection = db.collection('logsOfNewOrder')
//   const historyOrder = await .find({ $and: [{ account: { $eq: dealerAccount } }, { executionTime: { $gte: midnight } }] })
// }



module.exports = { mongodbExec, mongodbNewOrder, mongodbUpdateOrder, mongodbGetExecutionHistory };
