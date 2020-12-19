"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Art, {
        as: "arts",
        foreignKey: "userId",
      });
      User.hasMany(models.Post, {
        as: "post",
        foreignKey: "userId",
      });
      User.hasMany(models.Transaction, {
        as: "orderBy",
        foreignKey: "orderBy",
      });
      User.hasMany(models.Transaction, {
        as: "orderTo",
        foreignKey: "orderTo",
      });
      User.hasMany(models.Follow, {
        as: "following",
        foreignKey: "following",
      });
      User.hasMany(models.Follow, {
        as: "follower",
        foreignKey: "follower",
      });
    }
  }
  User.init(
    {
      fullname: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      profpic: DataTypes.STRING,
      greeting: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
