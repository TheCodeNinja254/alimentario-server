const Sequelize = require("sequelize");

module.exports = {
  async up(queryInterface) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    return queryInterface.createTable("users", {
      id: {
        type: Sequelize.INTEGER,
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
        type: Sequelize.INTEGER,
      },
      emailAddress: {
        type: Sequelize.STRING(100),
      },
      verificationToken: {
        type: Sequelize.STRING(255),
      },
      verificationStatus: {
        type: Sequelize.INTEGER,
      },
      verificationTime: {
        type: Sequelize.DATE,
      },
      addedBy: Sequelize.STRING(30),
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
    return queryInterface.dropTable("users");
  },
};
