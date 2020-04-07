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
    'type': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null",
      references: {
        model: 'type',
        key: 'id'
      }
    },
    'description': {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: "null"
    },
    'image': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    }
  }, {
    tableName: 'pro'
  });
};
