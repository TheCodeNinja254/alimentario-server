const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("Payment", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    paymentMethod: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    amountPaid: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
    },
    orderId: {
        type: Sequelize.INTEGER(11),
    },
    transactionId: {
        type: Sequelize.INTEGER(11),
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
});

// sequelize migration:create --name create_payments_table
