"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Transaction.belongsTo(models.User, {
        as: "orderedBy",
        foreignKey: "orderBy",
      });
      Transaction.belongsTo(models.User, {
        as: "orderedTo",
        foreignKey: "orderTo",
      });
      Transaction.hasOne(models.Project, {
        as: "project",
        foreignKey: "transactionId",
      });
    }
  }
  Transaction.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.STRING,
      startDate: DataTypes.DATE,
      endDate: DataTypes.DATE,
      price: DataTypes.INTEGER,
      orderBy: DataTypes.INTEGER,
      orderTo: DataTypes.INTEGER,
      status: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Transaction",
    }
  );
  return Transaction;
};
