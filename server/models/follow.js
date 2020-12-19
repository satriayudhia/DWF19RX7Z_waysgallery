"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Follow extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Follow.belongsTo(models.User, {
        as: "followUser",
        foreignKey: "following",
      });
      Follow.belongsTo(models.User, {
        as: "followerUser",
        foreignKey: "follower",
      });
    }
  }
  Follow.init(
    {
      following: DataTypes.INTEGER,
      follower: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Follow",
    }
  );
  return Follow;
};
