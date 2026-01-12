import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuiz, QuizDetail } from "../../services/api";

export default function QuizDetailPage() {
  const router = useRouter();
  const { id } = router.query;

  const [quiz, setQuiz] = useState<QuizDetail | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || typeof id !== "string") return;
    (async () => {
      try {
        setQuiz(await getQuiz(id));
      } catch (e: any) {
        setError(e?.message || "Error");
      }
    })();
  }, [id]);

  if (error) return <p style={{ color: "crimson" }}>{error}</p>;
  if (!quiz) return <p style={{ padding: 16 }}>Loading...</p>;

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <p>
        <Link href="/quizzes">← Back</Link>
      </p>
      <h1>{quiz.title}</h1>

      <ol style={{ display: "grid", gap: 12 }}>
        {quiz.questions.map((q) => (
          <li key={q.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 12 }}>
            <div style={{ fontWeight: 800 }}>
              [{q.type}] {q.prompt}
            </div>

            {q.type === "CHECKBOX" ? (
              <div style={{ marginTop: 8 }}>
                <div style={{ opacity: 0.8 }}>Correct indexes: {q.answer}</div>
                <ul>
                  {q.options.map((o) => (
                    <li key={o.id}>{o.text}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div style={{ marginTop: 8, opacity: 0.8 }}>Answer: {q.answer}</div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
