'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    customerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: "Customer Id is required"},
        notEmpty: {msg: "Customer Id is required"}
      }
    },
    artId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: "Art Id is required"},
        notEmpty: {msg: "Art Id is required"}
      }
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {msg: "Amount is required"},
        notEmpty: {msg: "Amount is required"}
      }
    },
    orderDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: {msg: "Order Date is required"},
        notEmpty: {msg: "Order Date is required"}
      }
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {msg: "Status is required"},
        notEmpty: {msg: "Status is required"}
      }
    }
  }, {
    sequelize,
    modelName: 'Order',
  });
  return Order;
};