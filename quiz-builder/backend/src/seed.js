const { sequelize } = require("../db/db");
const { Quiz, Question, Option, Category } = require("../models");

async function seed() {
  await sequelize.authenticate();
  await sequelize.sync();

  console.log("🌱 Seeding database...");

  // очистимо старі дані
  await Option.destroy({ where: {} });
  await Question.destroy({ where: {} });
  await Quiz.destroy({ where: {} });
  await Category.destroy({ where: {} });

  // створюємо категорії (шкільні предмети)
  const mathCategory = await Category.create({
    name: "Mathematics",
    slug: "mathematics",
    icon: "🔢",
  });

  const biologyCategory = await Category.create({
    name: "Biology",
    slug: "biology",
    icon: "🧬",
  });

  const physicsCategory = await Category.create({
    name: "Physics",
    slug: "physics",
    icon: "⚛️",
  });

  const chemistryCategory = await Category.create({
    name: "Chemistry",
    slug: "chemistry",
    icon: "🧪",
  });

  const historyCategory = await Category.create({
    name: "History",
    slug: "history",
    icon: "📜",
  });

  const geographyCategory = await Category.create({
    name: "Geography",
    slug: "geography",
    icon: "🌍",
  });

  const literatureCategory = await Category.create({
    name: "Literature",
    slug: "literature",
    icon: "📚",
  });

  const languageCategory = await Category.create({
    name: "Language",
    slug: "language",
    icon: "🗣️",
  });

  console.log("✅ Created 8 categories");

  // створюємо квіз з математики
  const quiz = await Quiz.create({
    title: "Demo Math Quiz",
    categoryId: mathCategory.id,
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
