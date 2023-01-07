'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    static associate(models) {
      // define association here
      Category.hasMany(models.Art)
    }
  }
  Category.init({
    name: {
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty:{
          msg:`Name cannot be empty`
        },
        notNull:{
          msg:`Name cannot be empty`
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Category',
  });
  return Category;
};