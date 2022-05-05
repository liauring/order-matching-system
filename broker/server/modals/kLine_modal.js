let { db } = require('../../util/mongodb');

const mongodbGetExecutionHistory = async (symbol, time) => {
  let midnight = new Date(new Date(time).setHours(0, 0, 0, 0)).getTime();
  const collection = db.collection('executions')
  const executionHistory = await collection.find({ $and: [{ symbol: { $eq: symbol } }, { executionTime: { $gte: midnight } }] }).project({ symbol: 1, price: 1, executionTime: 1, _id: 0 }).toArray();
  return executionHistory;
}

module.exports = { mongodbGetExecutionHistory };