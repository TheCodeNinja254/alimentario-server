const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("Product", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    autoIncrement: true,
  },
  addedBy: Sequelize.STRING(300),
  productName: Sequelize.STRING(300),
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// sequelize migration:create --name create_products_table
