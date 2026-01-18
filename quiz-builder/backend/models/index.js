const { Quiz } = require("./Quiz");
const { Question } = require("./Question");
const { Option } = require("./Option");
const Category = require("./Category");

// Category -> Quizzes
Category.hasMany(Quiz, { foreignKey: "categoryId", as: "quizzes" });
Quiz.belongsTo(Category, { foreignKey: "categoryId", as: "category" });

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

module.exports = { Quiz, Question, Option, Category };
