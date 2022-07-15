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
    return queryInterface.createTable("storage_facilities", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      facilityName: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      facilityLocation: {
        type: Sequelize.STRING(255),
      },
      facilityLocationLatitude: {
        type: Sequelize.STRING(30),
      },
      facilityLocationLongitude: {
        type: Sequelize.STRING(30),
      },
      facilityType: {
        type: Sequelize.STRING(30),
      },
      facilityMannedBy: {
        type: Sequelize.STRING(30),
      },
      facilityOpeningTime: {
        type: Sequelize.DATE,
      },
      facilityClosureTime: {
        type: Sequelize.DATE,
      },
      facilityCapacity: {
        type: Sequelize.INTEGER,
      },
      facilityCurrentStatus: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable("storage_facilities");
  },
};
