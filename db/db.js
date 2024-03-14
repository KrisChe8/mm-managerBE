const {Pool} = require("pg");
require("dotenv").config();

// const pool = new Pool({
//     database: process.env.DATABASE_NAME,
//     port: 5432,
//     host: process.env.DATABASE_HOST
// })

// module.exports = pool;

// handle using the correct environment variables here
const ENV = process.env.NODE_ENV || "development";
const path = `${__dirname}/../.env.${ENV}`;
require("dotenv").config({
  path: path
})
if (!process.env.DATABASE_NAME) {
  throw new Error('DATABASE_NAME not set');
}

module.exports = new Pool();