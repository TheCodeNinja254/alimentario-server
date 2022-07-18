module.exports = (sequelize, Sequelize) =>
  sequelize.define(
    "Transaction",
    {
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
    },
    {
      tableName: "transactions",
    }
  );

// sequelize migration:create --name create_transactions_table
