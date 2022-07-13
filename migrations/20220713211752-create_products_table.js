"use strict";

const Sequelize = require("sequelize");
module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("products"),
      {
        id: {
          type: Sequelize.INTEGER(11),
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
        },
        productName: Sequelize.STRING(300),
        createdAt: Sequelize.DATE,
        updatedAt: Sequelize.DATE,
      };
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("products");
  },
};


// sequelize db:migrate
// sequelize db:migrate:undo
// sequelize db:migrate:undo all
