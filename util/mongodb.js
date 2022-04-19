const { MongoClient } = require('mongodb');

const url = `mongodb://${process.env.mongodbUser}:${process.env.mongodbPW}@${process.env.mongodbHost}:${process.env.mongodbPort}/?maxPoolSize=20&w=majority`;

const client = new MongoClient(url);
(async () => {
  await client.connect();
  console.log("Connected successfully to server");
})();

const mongodbExec = async function (data) {
  // await mongodbConn(); //TODO:檢查斷線
  const collection = client.db('oms').collection('executions')
  const insertResult = await collection.insertMany([data]);
  return insertResult
};

module.exports = mongodbExec;
