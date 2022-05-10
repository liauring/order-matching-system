const wrapAsync = (fn) => {
  return function (req, res, next) {
    // Make sure to `.catch()` any errors and pass them along to the `next()`
    // middleware in the chain, in this case the error handler.
    fn(req, res, next).catch(next)
  }
}

let { db } = require('./mongodb')
const saveLogs = (logCollection) => {
  return async (req, res, next) => {
    try {
      const time = new Date().getTime()
      req.body.logCreateTime = time
      const collection = db.collection(logCollection)
      await collection.insertOne(req.body)
      return next()
    } catch (error) {
      next(error)
    }
  }
}

module.exports = {
  wrapAsync,
  saveLogs,
}
