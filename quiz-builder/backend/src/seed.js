const { sequelize } = require("../db/db");
const { Quiz, Question, Option } = require("../models");

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  console.log("🌱 Seeding database...");

  // очистимо старі дані
  await Option.destroy({ where: {} });
  await Question.destroy({ where: {} });
  await Quiz.destroy({ where: {} });

  // створюємо квіз
  const quiz = await Quiz.create({
    title: "Demo Quiz",
  });

  // BOOLEAN
  await Question.create({
    quizId: quiz.id,
    type: "BOOLEAN",
    prompt: "2 + 2 = 4 ?",
    answer: "true",
  });

  // INPUT
  await Question.create({
    quizId: quiz.id,
    type: "INPUT",
    prompt: "Capital of Ukraine?",
    answer: "Kyiv",
  });

  // CHECKBOX
  const checkboxQuestion = await Question.create({
    quizId: quiz.id,
    type: "CHECKBOX",
    prompt: "Select prime numbers",
    answer: JSON.stringify([0, 1]), // правильні індекси
  });

  await Option.bulkCreate([
    { questionId: checkboxQuestion.id, text: "2" },
    { questionId: checkboxQuestion.id, text: "3" },
    { questionId: checkboxQuestion.id, text: "4" },
    { questionId: checkboxQuestion.id, text: "9" },
  ]);

  console.log("✅ Seed completed! Demo quiz created.");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed error:", e);
  process.exit(1);
});
