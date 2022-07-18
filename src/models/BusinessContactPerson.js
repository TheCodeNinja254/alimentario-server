module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "BusinessContactPerson",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      businessId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      memberName: {
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      msisdn: {
        type: Sequelize.STRING(30),
      },
      emailAddress: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "business_contact_persons",
    }
  );

// sequelize migration:create --name create_business_contact_persons_table
