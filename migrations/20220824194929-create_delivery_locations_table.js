const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("delivery_locations", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      countryId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      countyId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      localeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
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
      addedBy: {
        type: Sequelize.STRING(30),
      },
      updatedBy: Sequelize.STRING(30),
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  async down(queryInterface) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    return queryInterface.dropTable("delivery_locations");
  },
};
