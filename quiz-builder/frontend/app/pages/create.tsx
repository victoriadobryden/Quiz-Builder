import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { createQuiz, getCategories, Category } from "../services/api";
import { AppLayout } from "../components/layout/AppLayout";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Alert } from "../components/ui/Alert";

type Question =
  | { type: "BOOLEAN"; prompt: string; answer: boolean }
  | { type: "INPUT"; prompt: string; answer: string }
  | { type: "CHECKBOX"; prompt: string; options: string[]; correctOptionIndexes: number[]; correctIndexesInput?: string };

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
      } catch (e: any) {
        console.error("Failed to load categories:", e);
      }
    })();
  }, []);

  function addQuestion(type: Question["type"]) {
    const q: Question =
      type === "BOOLEAN"
        ? { type: "BOOLEAN", prompt: "", answer: true }
        : type === "INPUT"
          ? { type: "INPUT", prompt: "", answer: "" }
          : { type: "CHECKBOX", prompt: "", options: ["", ""], correctOptionIndexes: [0], correctIndexesInput: "0" };

    setQuestions((prev) => [...prev, q]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const payload = { title, categoryId: categoryId || null, questions };
      const created = await createQuiz(payload);
      router.push(`/quizzes/${created.id}`);
    } catch (e: any) {
      setError(e?.message || "Failed");
    }
  }

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Quiz</h1>
          <p className="text-gray-600">Design your quiz with multiple question types</p>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        <form onSubmit={onSubmit} className="space-y-8">
          <Card>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quiz Details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="quiz-title" className="block text-sm font-medium text-gray-700 mb-1">
                  Quiz Title
                </label>
                <input
                  id="quiz-title"
                  type="text"
                  className="input-field"
                  placeholder="Enter a descriptive title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Category (Subject)
                </label>
                <select
                  id="category"
                  className="input-field"
                  value={categoryId}
                  onChange={(e) => setCategoryId(e.target.value)}
                >
                  <option value="">Select a category...</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Add Questions</h3>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="secondary" onClick={() => addQuestion("BOOLEAN")}>
                + Boolean Question
              </Button>
              <Button type="button" variant="secondary" onClick={() => addQuestion("INPUT")}>
                + Input Question
              </Button>
              <Button type="button" variant="secondary" onClick={() => addQuestion("CHECKBOX")}>
                + Checkbox Question
              </Button>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Questions ({questions.length})
            </h2>

            {questions.length === 0 && (
              <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <p className="text-gray-600">No questions yet. Add your first question above.</p>
              </div>
            )}

            {questions.map((q, idx) => (
              <Card key={idx}>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-900">Q{idx + 1}</span>
                    <Badge type={q.type} />
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQuestion(idx)}
                    className="text-red-600 hover:bg-red-50"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor={`prompt-${idx}`} className="block text-sm font-medium text-gray-700 mb-1">
                      Question Prompt
                    </label>
                    <input
                      id={`prompt-${idx}`}
                      type="text"
                      className="input-field"
                      placeholder="Enter your question"
                      value={q.prompt}
                      onChange={(e) => {
                        const v = e.target.value;
                        setQuestions((prev) =>
                          prev.map((x, i) => (i === idx ? ({ ...x, prompt: v } as any) : x))
                        );
                      }}
                    />
                  </div>

                  {q.type === "BOOLEAN" && (
                    <div>
                      <span className="block text-sm font-medium text-gray-700 mb-2">Answer</span>
                      <div className="flex gap-4 p-4 bg-gray-50 rounded-md">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                            checked={q.answer === true}
                            onChange={() =>
                              setQuestions((prev) =>
                                prev.map((x, i) => (i === idx ? ({ ...x, answer: true } as any) : x))
                              )
                            }
                          />
                          <span className="text-sm font-medium text-gray-700">True</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="radio"
                            className="w-4 h-4 text-sky-600 border-gray-300 focus:ring-sky-500"
                            checked={q.answer === false}
                            onChange={() =>
                              setQuestions((prev) =>
                                prev.map((x, i) => (i === idx ? ({ ...x, answer: false } as any) : x))
                              )
                            }
                          />
                          <span className="text-sm font-medium text-gray-700">False</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {q.type === "INPUT" && (
                    <div>
                      <label htmlFor={`answer-${idx}`} className="block text-sm font-medium text-gray-700 mb-1">
                        Correct Answer
                      </label>
                      <input
                        id={`answer-${idx}`}
                        type="text"
                        className="input-field"
                        placeholder="Enter the correct answer"
                        value={q.answer}
                        onChange={(e) => {
                          const v = e.target.value;
                          setQuestions((prev) =>
                            prev.map((x, i) => (i === idx ? ({ ...x, answer: v } as any) : x))
                          );
                        }}
                      />
                    </div>
                  )}

                  {q.type === "CHECKBOX" && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Options</label>
                        <div className="space-y-2">
                          {q.options.map((opt, oi) => (
                            <div key={oi} className="flex gap-2">
                              <input
                                type="text"
                                className="input-field flex-1"
                                placeholder={`Option ${oi + 1}`}
                                value={opt}
                                onChange={(e) => {
                                  const v = e.target.value;
                                  setQuestions((prev) =>
                                    prev.map((x, i) => {
                                      if (i !== idx || x.type !== "CHECKBOX") return x;
                                      const next = [...x.options];
                                      next[oi] = v;
                                      return { ...x, options: next };
                                    })
                                  );
                                }}
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setQuestions((prev) =>
                                    prev.map((x, i) => {
                                      if (i !== idx || x.type !== "CHECKBOX") return x;
                                      const nextOptions = x.options.filter((_, k) => k !== oi);
                                      const nextCorrect = x.correctOptionIndexes
                                        .filter((k) => k !== oi)
                                        .map((k) => (k > oi ? k - 1 : k));

                                      return {
                                        ...x,
                                        options: nextOptions.length >= 2 ? nextOptions : ["", ""],
                                        correctOptionIndexes: nextCorrect.length ? nextCorrect : [0],
                                      };
                                    })
                                  );
                                }}
                                className="text-red-600 hover:bg-red-50"
                                disabled={q.options.length <= 2}
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </Button>
                            </div>
                          ))}
                        </div>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setQuestions((prev) =>
                              prev.map((x, i) => {
                                if (i !== idx || x.type !== "CHECKBOX") return x;
                                return { ...x, options: [...x.options, ""] };
                              })
                            );
                          }}
                          className="mt-2"
                        >
                          + Add Option
                        </Button>
                      </div>

                      <div>
                        <label htmlFor={`correct-${idx}`} className="block text-sm font-medium text-gray-700 mb-1">
                          Correct Option Indexes
                        </label>
                        <input
                          id={`correct-${idx}`}
                          type="text"
                          className="input-field"
                          placeholder="e.g., 0,2 (comma-separated)"
                          value={q.correctOptionIndexes.join(",")}
                          onChange={(e) => {
                            const value = e.target.value;

                            // Allow typing freely, parse on blur or submit
                            const nums = value
                              .split(",")
                              .map((s) => s.trim())
                              .filter((s) => s !== "")
                              .map(Number)
                              .filter((n) => !isNaN(n) && Number.isInteger(n) && n >= 0);

                            setQuestions((prev) =>
                              prev.map((x, i) => {
                                if (i !== idx || x.type !== "CHECKBOX") return x;
                                // Keep at least [0] if nothing valid entered
                                return { ...x, correctOptionIndexes: nums.length > 0 ? nums : [0] };
                              })
                            );
                          }}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Enter the indexes of correct options (0-based, e.g., 0,2 for first and third options)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" disabled={!title || questions.length === 0}>
              Create Quiz
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
