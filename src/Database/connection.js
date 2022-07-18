const Sequelize = require("sequelize");
const config = require("dotenv").config();

const configValues = config.parsed;

const sequelize = new Sequelize(
  configValues.DATABASE,
  configValues.DB_USER,
  configValues.DB_PASSWORD,
  {
    host: configValues.HOST,
    dialect: configValues.DIALECT,
  }
);

module.exports = sequelize;
