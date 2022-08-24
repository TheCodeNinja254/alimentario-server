module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "DeliveryLocations",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      countyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      localeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "delivery_locations",
    }
  );

// sequelize migration:create --name create_delivery_locations_table
