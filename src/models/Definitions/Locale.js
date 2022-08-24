module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "Locale",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      localeName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      countyId: {
        type: Sequelize.INTEGER,
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
      tableName: "locales",
    }
  );

// sequelize migration:create --name create_locales_table
