const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/db");

const Question = sequelize.define(
  "Question",
  {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    quizId: { type: DataTypes.UUID, allowNull: false },

    // BOOLEAN | INPUT | CHECKBOX
    type: {
      type: DataTypes.ENUM("BOOLEAN", "INPUT", "CHECKBOX"),
      allowNull: false,
    },

    prompt: { type: DataTypes.TEXT, allowNull: false },

    // BOOLEAN: "true"/"false"
    // INPUT: expected answer text
    // CHECKBOX: JSON string e.g. "[0,2]"
    answer: { type: DataTypes.TEXT, allowNull: true },
  },
  { tableName: "questions" }
);

module.exports = { Question };
