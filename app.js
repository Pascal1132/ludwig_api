const express = require('express')
const app = express()
const util = require('util');
require('dotenv').config()
const port = 4000
const mysql = require('mysql');
var RoutingController = require('./src/Routing/RoutingController');
const bodyParser = require('body-parser')

require("./src/Utility/cacheManager");

app.use(bodyParser.json())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

const conn = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});
// node native promisify
const query = util.promisify(conn.query).bind(conn);

app.use('', RoutingController(query));

app.listen(port, () => {
  console.log(`✅ App listening on port ${port}`);
})

module.exports = app;