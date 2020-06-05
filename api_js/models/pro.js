/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pro', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'ref_id_user': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null",
      references: {
        model: 'user',
        key: 'id'
      }
    },
    'nom': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '0',
      comment: "null"
    },
    'type': {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '0',
      comment: "null"
    },
    'description': {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "null"
    },
    'image': {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: "null"
    },
    'createdAt': {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "null"
    },
    'updatedAt': {
      type: DataTypes.DATE,
      allowNull: false,
      comment: "null"
    },
  }, {
    tableName: 'pro'
  });
};
