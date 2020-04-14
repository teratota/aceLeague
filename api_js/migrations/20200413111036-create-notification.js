'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('notification', {
      id: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        primaryKey: true,
        primaryKey: true,
        comment: "null",
        autoIncrement: true
      },
      ref_id_user: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        comment: "null",
        references: {
          model: 'user',
          key: 'id'
        }
      },
      texte: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: "null"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('notifiation');
  }
};
