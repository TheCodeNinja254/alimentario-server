module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "Country",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      countryName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      countyFlagUri: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "countries",
    }
  );

// sequelize migration:create --name create_countries_table
