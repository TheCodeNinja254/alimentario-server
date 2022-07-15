const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

/*
* The model upon migrations will create the plural of the User definition
* i.e User will be users.
* */

module.exports = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
    },
    firstName: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    lastName: {
        type: Sequelize.STRING(30),
    },
    password: {
        type: Sequelize.STRING(255),
    },
    msisdn: {
        type: Sequelize.STRING(30),
    },
    userRole: {
        type: Sequelize.STRING(30),
    },
    status: {
        type: Sequelize.INTEGER(11),
    },
    emailAddress: {
        type: Sequelize.STRING(100),
    },
    verificationToken: {
        type: Sequelize.STRING(255),
    },
    verificationStatus: {
        type: Sequelize.INTEGER(11),
    },
    verificationTime: {
        type: Sequelize.DATE,
    },
    addedBy: Sequelize.STRING(30),
    updatedBy: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

// sequelize migration:create --name create_users_table

