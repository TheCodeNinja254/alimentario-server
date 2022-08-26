module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "Order",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      paymentId: {
        type: Sequelize.INTEGER,
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
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "orders",
    }
  );

// sequelize migration:create --name create_orders_table
