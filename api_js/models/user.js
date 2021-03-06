/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('user', {
    'id': {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      primaryKey: true,
      comment: "null",
      autoIncrement: true
    },
    'email': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null"
    },
    'username': {
      type: DataTypes.STRING(50),
      allowNull: false,
      comment: "null",
      unique: true
    },
    'password': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null"
    },
    'bio': {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: "null"
    },
    'isAdmin': {
      type: DataTypes.INTEGER(4),
      allowNull: false,
      comment: "null"
    },
    'image': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null",
      unique: true
    },
    'sport': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null",
      unique: true
    },
    'level': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null",
      unique: true
    },
    'sportDescription': {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: "null",
      unique: true
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
    'token': {
      type: DataTypes.STRING(255),
      allowNull: true,
      comment: "null"
    },
    'token_date': {
      type: DataTypes.DATE,
      allowNull: true,
      comment: "null"
    }
  }, {
    tableName: 'user'
  });
};
