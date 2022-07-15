const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("transactions", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      transactionOriginatorId: {
        // card payment id, mpesa payment id, cash generated id
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      transactionType: {
        // cash, card, credit, M-PESA, other
        type: Sequelize.STRING(30),
        allowNull: false,
      },
      amountPaid: {
        type: Sequelize.INTEGER,
      },
      currency: {
        type: Sequelize.STRING(11),
        defaultValue: "Ksh",
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
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("transactions");
  },
};
