/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('commentaire', {
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
    'ref_id_publication': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      comment: "null",
      references: {
        model: 'publication',
        key: 'id'
      }
    },
    'message': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'commentaire'
  });
};
