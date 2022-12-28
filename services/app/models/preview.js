'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Preview extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Preview.belongsTo(models.Art)
    }
  }
  Preview.init({
    sourceUrl: {
      type:DataTypes.STRING,
      allowNull:false
    },
    ArtId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Preview',
  });
  return Preview;
};