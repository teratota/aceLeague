'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chat', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        primaryKey: true,
        comment: "null",
        autoIncrement: true
      },
      nom: {
        type: Sequelize.STRING(50),
        allowNull: false,
        comment: "null"
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "null"
      },
      updateAt: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: "null"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('chat');
  }
};
