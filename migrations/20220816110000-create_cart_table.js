const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("cart", {
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
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('cart');
     */
    return queryInterface.dropTable("cart");
  },
};
