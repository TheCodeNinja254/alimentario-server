module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "OrderSpecification",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      orderId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productQuantity: {
        type: Sequelize.INTEGER,
      },
      orderSpecification: {
        type: Sequelize.STRING(255),
      },
      addedBy: Sequelize.STRING(30), // customerId
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "order_specifications",
    }
  );

// sequelize migration:create --name create_order_specifications_table
