'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Art extends Model {
    static associate(models) {
      Art.hasMany(models.Preview)
      Art.belongsTo(models.Category)
      Art.hasMany(models.Order, { foreignKey: 'artId' })
    }
  }
  Art.init({
    name: {
      type: DataTypes.STRING,
      unique: {
        msg: "Name is already used"
      },
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name cannot be empty"
        },
        notNull: {
          msg: "Name cannot be empty"
        }
      }
    },
    source: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Source cannot be empty"
        },
        notNull: {
          msg: "Source cannot be empty"
        }
      }
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Price cannot be empty"
        },
        notNull: {
          msg: "Price cannot be empty"
        }
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description cannot be empty"
        },
        notNull: {
          msg: "Description cannot be empty"
        }
      }
    },
    AuthorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    CategoryId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Art',
  });
  return Art;
};