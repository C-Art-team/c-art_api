'use strict';
const {
  Model
} = require('sequelize');
const {hashPassword} = require('../helpers/')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type: DataTypes.STRING,
      unique: {msg: "Email already used"},
      allowNull: false,
      validate: {
        notNull: {msg: "Email is required"},
        notEmpty: {msg: "Email is required"},
        isEmail: {msg: "Invalid email format"}
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Password is required"},
        notEmpty: {msg: "Password is required"},
        len: {
          args: [5],
          msg: "Password cannot be shorter than 5 character"
        }
      }
    },
    username: {
      type: DataTypes.STRING,
      unique: {msg: "Username already used"},
      allowNull: false,
      validate: {
        notNull: {msg: "Username is required"},
        notEmpty: {msg: "Username is required"},
        len: {
          args: [5],
          msg: "Username cannot be shorter than 5 character"
        }
      }
    },
    preference: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate((user) => {
    user.password = hashPassword(user.password)
  })
  return User;
};