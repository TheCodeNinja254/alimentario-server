const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("Order", {
  id: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  paymentId: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  amountDue: {
    type: Sequelize.INTEGER(11),
    allowNull: false,
  },
  deliveryPreference: {
    type: Sequelize.STRING(255),
  },
  deliveryLocation: {
    type: Sequelize.STRING(255),
  },
  deliveryPreciseLocation: {
    type: Sequelize.STRING(255),
  },
  deliveryLocationLatitude: {
    type: Sequelize.STRING(255),
  },
  deliveryLocationLongitude: {
    type: Sequelize.STRING(255),
  },
  deliveryAdditionalNotes: {
    type: Sequelize.STRING(255),
  },
  alternativePhoneNumber: {
    type: Sequelize.STRING(30),
  },
  orderStatus: {
    type: Sequelize.STRING(30),
    defaultValue: "New",
  },
  orderType: {
    type: Sequelize.STRING(30),
    defaultValue: "Retail",
  },
  addedBy: {
    type: Sequelize.STRING(30),
  },
  updatedBy: Sequelize.STRING(30),
  createdAt: Sequelize.DATE,
  updatedAt: Sequelize.DATE,
});

// sequelize migration:create --name create_orders_table