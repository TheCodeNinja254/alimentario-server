module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "Cart",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      productId: {
        // fk to products table
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      quantity: {
        // quantity the customer is interested in
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      customerSpecification: {
        // additional information from the customer regarding their order
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "cart",
    }
  );

// sequelize migration:create --name create_cart_table
