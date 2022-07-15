const Sequelize = require("sequelize");

const sequelize = new Sequelize(
  "desafiodb",
  "desafio",
  "TusentakkVashegul19!",
  {
    host: "localhost",
    dialect: "mysql",
  }
);

module.exports = sequelize;
