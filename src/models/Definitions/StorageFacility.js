module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "StorageFacility",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      facilityName: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      facilityLocation: {
        type: Sequelize.STRING(255),
      },
      facilityLocationLatitude: {
        type: Sequelize.STRING(30),
      },
      facilityLocationLongitude: {
        type: Sequelize.STRING(30),
      },
      facilityType: {
        type: Sequelize.STRING(30),
      },
      facilityMannedBy: {
        type: Sequelize.STRING(30),
      },
      facilityOpeningTime: {
        type: Sequelize.DATE,
      },
      facilityClosureTime: {
        type: Sequelize.DATE,
      },
      facilityCapacity: {
        type: Sequelize.INTEGER,
      },
      facilityCurrentStatus: {
        type: Sequelize.INTEGER,
      },
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "storage_facilities",
    }
  );

// sequelize migration:create --name create_storage_facilities_table
