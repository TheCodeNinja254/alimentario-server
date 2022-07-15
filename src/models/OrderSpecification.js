const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("OrderSpecification", {
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
    orderSpacification: {
        type: Sequelize.STRING(255),
    },
    msisdn: {
        type: Sequelize.STRING(30),
    },
    addedBy: Sequelize.STRING(30), // customerId
    updatedBy: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

// sequelize migration:create --name create_order_specifications_table

