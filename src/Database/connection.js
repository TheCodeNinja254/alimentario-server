const Sequelize = require("sequelize");
const config = require("dotenv").config();

const configValues = config.parsed;

const sequelize = new Sequelize(
  configValues.DATABASE,
  configValues.DB_USER,
  configValues.DB_PASSWORD,
  {
    host: "127.0.0.1",
    dialect: configValues.DIALECT,
    dialectOptions: process.env.NODE_ENV !== 'production' && {
      socketPath: '/tmp/mysql.sock',
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize;
