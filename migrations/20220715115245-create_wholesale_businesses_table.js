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
    return queryInterface.createTable("wholesale_businesses", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      businessName: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true,
      },
      registeredAddress: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      businessLocationLatitude: {
        type: Sequelize.STRING(30),
      },
      businessLocationLongitude: {
        type: Sequelize.STRING(30),
      },
      businessType: {
        type: Sequelize.STRING(30),
      },
      registrationNumber: {
        type: Sequelize.STRING(255),
        unique: true,
      },
      registrationCertificateUri: {
        type: Sequelize.STRING(255),
      },
      cr12UploadUri: {
        type: Sequelize.STRING(255),
      },
      businessStatus: {
        type: Sequelize.INTEGER,
      },
      primaryEmailAddress: {
        type: Sequelize.STRING(100),
      },
      primaryContact: {
        type: Sequelize.STRING(100),
      },
      businessWebsite: {
        type: Sequelize.STRING(255),
      },
      kraPin: {
        type: Sequelize.STRING(30),
      },
      kraPinUploadUrl: {
        type: Sequelize.STRING(255),
      },
      currentBusinessPermitUri: {
        type: Sequelize.STRING(255),
      },
      preferredCreditPeriod: {
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
    return queryInterface.dropTable("wholesale_businesses");
  },
};
