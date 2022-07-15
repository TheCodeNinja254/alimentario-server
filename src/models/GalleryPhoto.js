const Sequelize = require("sequelize");
const sequelize = require("../Database/connection");

module.exports = sequelize.define("GalleryPhoto", {
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
}, {
  tableName: 'gallery_photos'
});

// sequelize migration:create --name create_gallery_photos_table
