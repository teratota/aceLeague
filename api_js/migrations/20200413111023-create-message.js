'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('message', {
    title: Sequelize.STRING,
    content: Sequelize.STRING,
    attachment: Sequelize.STRING,
    likes: Sequelize.INTEGER
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('message');
  }
};
