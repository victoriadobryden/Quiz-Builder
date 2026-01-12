import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteQuiz, getQuizzes, QuizListItem } from "../../services/api";

export default function QuizzesPage() {
  const [items, setItems] = useState<QuizListItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setItems(await getQuizzes());
      } catch (e: any) {
        setError(e?.message || "Error");
      }
    })();
  }, []);

  async function onDelete(id: string) {
    if (!confirm("Delete this quiz?")) return;
    await deleteQuiz(id);
    setItems((prev) => prev.filter((x) => x.id !== id));
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <h1>Quizzes</h1>
      <p>
        <Link href="/create">Create new quiz</Link>
      </p>

      {error && <p style={{ color: "crimson" }}>{error}</p>}

      <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
        {items.map((q) => (
          <li
            key={q.id}
            style={{
              border: "1px solid #ddd",
              borderRadius: 10,
              padding: 12,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div>
              <Link href={`/quizzes/${q.id}`} style={{ fontWeight: 700 }}>
                {q.title}
              </Link>
              <div style={{ opacity: 0.7, fontSize: 14 }}>{q.questionCount} questions</div>
            </div>
            <button onClick={() => onDelete(q.id)} aria-label="Delete">
              🗑️
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
