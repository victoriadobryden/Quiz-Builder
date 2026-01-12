const { Quiz } = require("./Quiz");
const { Question } = require("./Question");
const { Option } = require("./Option");

// Quiz -> Questions
Quiz.hasMany(Question, { foreignKey: "quizId", as: "questions", onDelete: "CASCADE", hooks: true });
Question.belongsTo(Quiz, { foreignKey: "quizId", as: "quiz" });

// Question -> Options
Question.hasMany(Option, {
  foreignKey: "questionId",
  as: "options",
  onDelete: "CASCADE",
  hooks: true,
});
Option.belongsTo(Question, { foreignKey: "questionId", as: "question" });

module.exports = { Quiz, Question, Option };
