module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "Customer",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING(30),
      },
      password: {
        type: Sequelize.STRING(255),
      },
      msisdn: {
        type: Sequelize.STRING(30),
      },
      status: {
        type: Sequelize.INTEGER,
      },
      businessId: {
        type: Sequelize.INTEGER,
      },
      emailAddress: {
        type: Sequelize.STRING(100),
      },
      verificationToken: {
        type: Sequelize.STRING(255),
      },
      verificationStatus: {
        type: Sequelize.INTEGER,
      },
      verificationTime: {
        type: Sequelize.DATE,
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "customers",
    }
  );

// sequelize migration:create --name create_customers_table
