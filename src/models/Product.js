const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define(
  "Product",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    productName: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
    },
    productDescription: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    productPicMain: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    productPicTwo: {
      type: Sequelize.STRING(255),
    },
    productPicThree: {
      type: Sequelize.STRING(255),
    },
    productPicFour: {
      type: Sequelize.STRING(255),
    },
    productUnitOfMeasure: {
      type: Sequelize.STRING(255),
    },
    productInstructionsLink: {
      type: Sequelize.STRING(255),
    },
    productVideoLink: {
      type: Sequelize.STRING(255),
    },
    stockStatus: {
      type: Sequelize.STRING(255),
    },
    productStatus: {
      type: Sequelize.INTEGER,
    },
    expiryDate: {
      type: Sequelize.DATE,
    },
    productStorageFacility: {
      type: Sequelize.INTEGER,
    },
    addedBy: Sequelize.STRING(30),
    updatedBy: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    tableName: "products",
  }
);

// sequelize migration:create --name create_products_table
