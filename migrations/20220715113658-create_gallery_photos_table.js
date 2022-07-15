const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("gallery_photos", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      photoUri: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      photoDescription: {
        type: Sequelize.STRING(255),
      },
      photoName: {
        type: Sequelize.STRING(255),
      },
      photoPreferredLocation: {
        type: Sequelize.STRING(50),
      },
      photoTag: {
        type: Sequelize.STRING(30),
      },
      photoBy: {
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
    return queryInterface.dropTable("gallery_photos");
  },
};
