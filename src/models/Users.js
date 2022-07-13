const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("User", {
    id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        autoIncrement: true,
    },
    username: {
        type: Sequelize.STRING(300),
        allowNull: false,
        unique: true,
    },
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

// sequelize migration:create --name create_users_table
