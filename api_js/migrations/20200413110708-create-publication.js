'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('publication', {
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
      image: {
        type: Sequelize.STRING(50),
        allowNull: true,
        comment: "null"
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: "null"
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        comment: "null"
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('publication');
  }
};
