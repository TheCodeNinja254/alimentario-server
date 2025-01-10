module.exports = (sequelize, Sequelize) => sequelize.define(
  "Order",
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    paymentId: {
      type: Sequelize.STRING(120),
      allowNull: false,
    },
    amountDue: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    deliveryLocationId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    orderStatus: {
      type: Sequelize.STRING(30),
      defaultValue: "New",
    },
    orderType: {
      type: Sequelize.STRING(30),
      defaultValue: "Retail",
    },
    checkoutRequestId: {
      type: Sequelize.STRING(30),
    },
    addedBy: {
      type: Sequelize.STRING(30),
    },
    isPreorder: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    preferredDeliveryTime: {
      type: Sequelize.STRING(20),
    },
    updatedBy: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    tableName: "orders",
  },
);

// sequelize migration:create --name create_orders_table
