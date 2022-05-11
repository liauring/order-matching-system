const mysql = require('mysql2/promise')
require('dotenv').config({ path: __dirname + '/./../.env' })

const mysqldb = mysql.createPool({
  host: process.env.mysqlHost,
  user: process.env.mysqlUser,
  password: process.env.mysqlPW,
  database: process.env.mysqlDB,
  waitForConnections: true,
  connectionLimit: 10,
  connectTimeout: 15000,
  rowsAsArray: false,
  enableKeepAlive: true,
  multipleStatements: true,
})

module.exports = { mysqldb }
