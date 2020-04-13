/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('type', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'nom': {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: '0',
      comment: "null"
    }
  }, {
    tableName: 'type'
  });
};
