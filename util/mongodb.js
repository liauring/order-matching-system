const { MongoClient } = require('mongodb');

const url = `mongodb://${process.env.mongodbUser}:${process.env.mongodbPW}@${process.env.mongodbHost}:${process.env.mongodbPort}/?maxPoolSize=20&w=majority`;

const client = new MongoClient(url);
(async () => {
  await client.connect();
  console.log("Connected successfully to server");
})();
// const mongodbConn = async function () {
//   await client.connect();
//   console.log("Connected successfully to server"); //每次都連一次？
// }

const mongodbExec = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = client.db('oms').collection('executions')
  const insertResult = await collection.insertMany([data]);
  return insertResult
};

// const mongodbExec = async function (data) {

//   await mongodbConn();
//   console.log("aftet conn");
//   return client.db('oms').collection('executions')

// };

module.exports = mongodbExec;
