"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class ProjectImage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ProjectImage.belongsTo(models.Project, {
        as: "images",
        foreignKey: "projectId",
      });
    }
  }
  ProjectImage.init(
    {
      projectId: DataTypes.INTEGER,
      photo: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "ProjectImage",
    }
  );
  return ProjectImage;
};
