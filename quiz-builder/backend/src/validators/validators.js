function isNonEmptyString(x) {
  return typeof x === "string" && x.trim().length > 0;
}

function validateCreateQuiz(body) {
  if (!body || typeof body !== "object") return { ok: false, message: "Body must be an object" };
  if (!isNonEmptyString(body.title)) return { ok: false, message: "title is required" };
  if (!Array.isArray(body.questions) || body.questions.length === 0)
    return { ok: false, message: "questions must be a non-empty array" };

  for (let i = 0; i < body.questions.length; i++) {
    const q = body.questions[i];
    if (!q || typeof q !== "object") return { ok: false, message: `questions[${i}] invalid` };
    if (!isNonEmptyString(q.prompt))
      return { ok: false, message: `questions[${i}].prompt required` };

    if (!["BOOLEAN", "INPUT", "CHECKBOX"].includes(q.type))
      return { ok: false, message: `questions[${i}].type invalid` };

    if (q.type === "BOOLEAN") {
      if (typeof q.answer !== "boolean")
        return { ok: false, message: `questions[${i}].answer must be boolean` };
    }

    if (q.type === "INPUT") {
      if (!isNonEmptyString(q.answer))
        return { ok: false, message: `questions[${i}].answer must be string` };
    }

    if (q.type === "CHECKBOX") {
      if (!Array.isArray(q.options) || q.options.length < 2)
        return { ok: false, message: `questions[${i}].options must be array (min 2)` };
      if (!Array.isArray(q.correctOptionIndexes) || q.correctOptionIndexes.length < 1)
        return { ok: false, message: `questions[${i}].correctOptionIndexes must be array (min 1)` };

      const maxIndex = q.options.length - 1;
      for (const idx of q.correctOptionIndexes) {
        if (!Number.isInteger(idx) || idx < 0 || idx > maxIndex) {
          return {
            ok: false,
            message: `questions[${i}].correctOptionIndexes contains out of range index (max ${maxIndex})`,
          };
        }
      }
    }
  }

  return { ok: true };
}

module.exports = { validateCreateQuiz };
