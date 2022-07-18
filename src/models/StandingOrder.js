module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "StandingOrder",
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
      orderCommencementDate: {
        type: Sequelize.DATE,
      },
      orderCycle: {
        type: Sequelize.STRING(30),
      },
      orderStatus: {
        type: Sequelize.STRING(30),
        defaultValue: "New",
      },
      orderType: {
        type: Sequelize.STRING(30),
        defaultValue: "Wholesale",
      },
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "standing_orders",
    }
  );

// sequelize migration:create --name create_standing_orders_table
