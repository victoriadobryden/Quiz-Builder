const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Quiz = sequelize.define(
  "Quiz",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false },
  },
  { tableName: "quizzes" }
);

module.exports = { Quiz };
