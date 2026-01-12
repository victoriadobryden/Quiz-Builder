const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Option = sequelize.define(
  "Option",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    questionId: { type: DataTypes.UUID, allowNull: false },
    text: { type: DataTypes.TEXT, allowNull: false },
  },
  { tableName: "options" }
);

module.exports = { Option };
