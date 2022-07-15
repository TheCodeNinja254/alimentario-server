const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("ShareholdersDirector", {
    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
    },
    businessId: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    memberName: {
        type: Sequelize.STRING(30),
        allowNull: false,
    },
    memberType: {
        type: Sequelize.STRING(30),
    },
    updatedBy: Sequelize.STRING(30),
    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
});

// sequelize migration:create --name create_shareholders_directors_table

