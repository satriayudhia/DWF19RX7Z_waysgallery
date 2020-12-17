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
        foreignKey: "userId",
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
