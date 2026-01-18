const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Category = sequelize.define(
  "Category",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: "Emoji or icon identifier",
    },
  },
  {
    tableName: "categories",
  }
);

module.exports = Category;
