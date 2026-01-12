const { Router } = require("express");
const { Quiz, Question, Option } = require("../../models");
const { sequelize } = require("../../db/db");
const { validateCreateQuiz } = require("../validators/validators");

const router = Router();

/**
 * POST /quizzes
 * body:
 * {
 *   title: string,
 *   questions: [
 *     { type:"BOOLEAN", prompt:"..", answer:true },
 *     { type:"INPUT", prompt:"..", answer:"text" },
 *     { type:"CHECKBOX", prompt:"..", options:["a","b"], correctOptionIndexes:[0] }
 *   ]
 * }
 */
router.post("/", async (req, res) => {
  const v = validateCreateQuiz(req.body);
  if (!v.ok) return res.status(400).json({ message: v.message });

  const dto = req.body;

  const result = await sequelize.transaction(async (t) => {
    const quiz = await Quiz.create({ title: dto.title }, { transaction: t });

    for (const q of dto.questions) {
      if (q.type === "BOOLEAN") {
        await Question.create(
          { quizId: quiz.id, type: "BOOLEAN", prompt: q.prompt, answer: String(q.answer) },
          { transaction: t }
        );
        continue;
      }

      if (q.type === "INPUT") {
        await Question.create(
          { quizId: quiz.id, type: "INPUT", prompt: q.prompt, answer: q.answer },
          { transaction: t }
        );
        continue;
      }

      // CHECKBOX
      const question = await Question.create(
        {
          quizId: quiz.id,
          type: "CHECKBOX",
          prompt: q.prompt,
          answer: JSON.stringify(q.correctOptionIndexes),
        },
        { transaction: t }
      );

      await Option.bulkCreate(
        q.options.map((text) => ({ questionId: question.id, text })),
        { transaction: t }
      );
    }

    return Quiz.findByPk(quiz.id, {
      include: [{ model: Question, as: "questions", include: [{ model: Option, as: "options" }] }],
      transaction: t,
    });
  });

  res.status(201).json(result);
});

/**
 * GET /quizzes
 * -> [{id,title,questionCount}]
 */
router.get("/", async (_req, res) => {
  const quizzes = await Quiz.findAll({
    order: [["createdAt", "DESC"]],
    include: [{ model: Question, as: "questions", attributes: ["id"] }],
  });

  res.json(
    quizzes.map((q) => ({
      id: q.id,
      title: q.title,
      questionCount: q.questions?.length || 0,
    }))
  );
});

/**
 * GET /quizzes/:id
 * -> full quiz
 */
router.get("/:id", async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id, {
    include: [{ model: Question, as: "questions", include: [{ model: Option, as: "options" }] }],
  });

  if (!quiz) return res.status(404).json({ message: "Quiz not found" });
  res.json(quiz);
});

/**
 * DELETE /quizzes/:id
 */
router.delete("/:id", async (req, res) => {
  const quiz = await Quiz.findByPk(req.params.id);
  if (!quiz) return res.status(404).json({ message: "Quiz not found" });

  await quiz.destroy();
  res.status(204).send();
});

module.exports = { quizzesRouter: router };
