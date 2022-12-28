'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static associate(models) {
      
    }
  }
  Chat.init({
    text: DataTypes.STRING,
    senderId: DataTypes.INTEGER,
    receiverId: DataTypes.INTEGER,
    tag: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Chat',
  });
  return Chat;
};