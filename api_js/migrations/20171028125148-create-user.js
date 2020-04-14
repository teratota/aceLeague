'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('user', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        primaryKey: true,
        comment: "null",
        autoIncrement: true
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "null"
      },
      username: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "null",
        unique: true
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: "null"
      },
      bio: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "null"
      },
      isAdmin: {
        type: Sequelize.INTEGER(4),
        allowNull: false,
        comment: "null"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "null"
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "null"
      },
      token: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: "null"
      },
      token_date: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "null"
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('user');
  }
};