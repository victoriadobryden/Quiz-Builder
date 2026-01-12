import { useState } from "react";
import { useRouter } from "next/router";
import { createQuiz } from "../services/api";

type Question =
  | { type: "BOOLEAN"; prompt: string; answer: boolean }
  | { type: "INPUT"; prompt: string; answer: string }
  | { type: "CHECKBOX"; prompt: string; options: string[]; correctOptionIndexes: number[] };

export default function CreatePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([
    { type: "BOOLEAN", prompt: "", answer: true },
  ]);
  const [error, setError] = useState("");

  function addQuestion(type: Question["type"]) {
    const q: Question =
      type === "BOOLEAN"
        ? { type: "BOOLEAN", prompt: "", answer: true }
        : type === "INPUT"
          ? { type: "INPUT", prompt: "", answer: "" }
          : { type: "CHECKBOX", prompt: "", options: ["", ""], correctOptionIndexes: [0] };

    setQuestions((prev) => [...prev, q]);
  }

  function removeQuestion(index: number) {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const payload = { title, questions };
      const created = await createQuiz(payload);
      router.push(`/quizzes/${created.id}`);
    } catch (e: any) {
      setError(e?.message || "Failed");
    }
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Create Quiz</h1>
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 6 }}>
          <span>Quiz title</span>
          <input value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button type="button" onClick={() => addQuestion("BOOLEAN")}>
            + Boolean
          </button>
          <button type="button" onClick={() => addQuestion("INPUT")}>
            + Input
          </button>
          <button type="button" onClick={() => addQuestion("CHECKBOX")}>
            + Checkbox
          </button>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          {questions.map((q, idx) => (
            <div key={idx} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                <strong>
                  Q{idx + 1} — {q.type}
                </strong>
                <button type="button" onClick={() => removeQuestion(idx)}>
                  Remove
                </button>
              </div>

              <label style={{ display: "grid", gap: 6, marginTop: 10 }}>
                <span>Prompt</span>
                <input
                  value={q.prompt}
                  onChange={(e) => {
                    const v = e.target.value;
                    setQuestions((prev) =>
                      prev.map((x, i) => (i === idx ? ({ ...x, prompt: v } as any) : x))
                    );
                  }}
                />
              </label>

              {q.type === "BOOLEAN" && (
                <div style={{ marginTop: 10, display: "flex", gap: 12 }}>
                  <label>
                    <input
                      type="radio"
                      checked={q.answer === true}
                      onChange={() =>
                        setQuestions((prev) =>
                          prev.map((x, i) => (i === idx ? ({ ...x, answer: true } as any) : x))
                        )
                      }
                    />
                    True
                  </label>
                  <label>
                    <input
                      type="radio"
                      checked={q.answer === false}
                      onChange={() =>
                        setQuestions((prev) =>
                          prev.map((x, i) => (i === idx ? ({ ...x, answer: false } as any) : x))
                        )
                      }
                    />
                    False
                  </label>
                </div>
              )}

              {q.type === "INPUT" && (
                <label style={{ display: "grid", gap: 6, marginTop: 10 }}>
                  <span>Answer</span>
                  <input
                    value={q.answer}
                    onChange={(e) => {
                      const v = e.target.value;
                      setQuestions((prev) =>
                        prev.map((x, i) => (i === idx ? ({ ...x, answer: v } as any) : x))
                      );
                    }}
                  />
                </label>
              )}

              {q.type === "CHECKBOX" && (
                <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <span>Options</span>
                    {q.options.map((opt, oi) => (
                      <div key={oi} style={{ display: "flex", gap: 8 }}>
                        <input
                          value={opt}
                          placeholder={`Option ${oi + 1}`}
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
                        <button
                          type="button"
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
                        >
                          -
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => {
                        setQuestions((prev) =>
                          prev.map((x, i) => {
                            if (i !== idx || x.type !== "CHECKBOX") return x;
                            return { ...x, options: [...x.options, ""] };
                          })
                        );
                      }}
                    >
                      + Add option
                    </button>
                  </div>

                  <label style={{ display: "grid", gap: 6 }}>
                    <span>Correct indexes (comma-separated like 0,2)</span>
                    <input
                      value={q.correctOptionIndexes.join(",")}
                      onChange={(e) => {
                        const nums = e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean)
                          .map(Number)
                          .filter((n) => Number.isInteger(n) && n >= 0);

                        setQuestions((prev) =>
                          prev.map((x, i) => {
                            if (i !== idx || x.type !== "CHECKBOX") return x;
                            return { ...x, correctOptionIndexes: nums.length ? nums : [0] };
                          })
                        );
                      }}
                    />
                  </label>
                </div>
              )}
            </div>
          ))}
        </div>

        <button type="submit">Create quiz</button>
      </form>
    </div>
  );
}
