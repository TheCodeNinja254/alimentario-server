const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("payments", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      paymentMethod: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      amountPaid: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      orderId: {
        type: Sequelize.INTEGER,
      },
      orderType: {
        type: Sequelize.STRING(30),
        defaultValue: "Single", // enum: Single || Standing Order
      },
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
      merchantRequestId: {
        type: Sequelize.STRING(30),
      },
      checkoutRequestId: {
        type: Sequelize.STRING(30),
      },
      mpesaReceiptNumber: {
        type: Sequelize.STRING(30),
      },
      transactionDate: {
        type: Sequelize.STRING(30),
      },
      phoneNumber: {
        type: Sequelize.STRING(30),
      },
      paymentCorrelationId: {
        type: Sequelize.STRING(50),
      },
      resultCode: {
        type: Sequelize.INTEGER,
      },
      resultDesc: {
        type: Sequelize.STRING(50),
      },
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("payments");
  },
};
