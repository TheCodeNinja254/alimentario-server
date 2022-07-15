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
    return queryInterface.createTable("orders", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      paymentId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      amountDue: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      deliveryPreference: {
        type: Sequelize.STRING(255),
      },
      deliveryLocation: {
        type: Sequelize.STRING(255),
      },
      deliveryPreciseLocation: {
        type: Sequelize.STRING(255),
      },
      deliveryLocationLatitude: {
        type: Sequelize.STRING(255),
      },
      deliveryLocationLongitude: {
        type: Sequelize.STRING(255),
      },
      deliveryAdditionalNotes: {
        type: Sequelize.STRING(255),
      },
      alternativePhoneNumber: {
        type: Sequelize.STRING(30),
      },
      orderStatus: {
        type: Sequelize.STRING(30),
        defaultValue: "New",
      },
      orderType: {
        type: Sequelize.STRING(30),
        defaultValue: "Retail",
      },
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("orders");
  },
};
