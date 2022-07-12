const mysql = require("mysql");
const config = require("dotenv").config();

const configValues = config.parsed;

/**
 * Database Connection to MySql
 *
 * */
const connection = mysql.createConnection({
  host: configValues.HOST,
  user: configValues.DB_USER,
  password: configValues.DB_PASSWORD,
  database: configValues.DATABASE,
});

/**
 * Establish connection
 *
 * */
connection.connect();

/**
 * Sample Query
 * */
connection.query(`SELECT * FROM tbl_users`, (err, res) => {
  if (err)
    throw new Error(
      `Database connection lost. Please try again later! Error is ${err.sqlMessage}`
    );
  console.log(res);
});

/**
 *
 * Module exports
 * */

module.exports = connection;
