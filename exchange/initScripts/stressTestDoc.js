const createCsvWriter = require('csv-writer').createArrayCsvWriter

const csvWriter = createCsvWriter({
  // header: ['orderID', 'consumeFromRabbitmq', 'matchFinish', 'allExecutionFinish'],
  header: false,
  path: 'matchLogicTime.csv',
  append: true,
})

csvWriter
  .writeRecords([this.order.matchTime]) // returns a promise
  .then(() => {
    console.log(`[writeFile] ${this.orderID} is done.`)
  })
