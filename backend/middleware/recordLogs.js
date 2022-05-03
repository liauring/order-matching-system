const { mongodbNewOrder, mongodbUpdateOrder, mongodbGetExecutionHistory } = require('./util/mongodb');

class SaveLogs {
  constructor(reqBody) {
    this.reqBody = reqBody;
  }

}