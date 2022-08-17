module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "CartProduct",
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      cartId: {
        // fk to cart table
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      productId: {
        // fk to products table
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    },
    {
      tableName: "cartproduct",
    }
  );

// sequelize migration:create --name create_cartproduct_table
