const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("countries", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      countryName: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      countyFlagUri: {
        type: Sequelize.STRING(255),
        allowNull: false,
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
    return queryInterface.dropTable("countries");
  },
};
