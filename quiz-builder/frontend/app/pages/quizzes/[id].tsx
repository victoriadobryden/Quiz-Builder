import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getQuiz, QuizDetail } from "../../services/api";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Alert } from "../../components/ui/Alert";

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

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <Link
          href="/quizzes"
          className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Quizzes
        </Link>

        {error && <Alert variant="error">{error}</Alert>}

        {!quiz ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
          </div>
        ) : (
          <>
            <div className="bg-gradient-to-r from-sky-500 to-sky-600 rounded-xl p-8 text-white mb-8 shadow-lg">
              {quiz.category && (
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm mb-3">
                  <span className="text-lg">{quiz.category.icon}</span>
                  <span>{quiz.category.name}</span>
                </div>
              )}
              <h1 className="text-3xl font-bold mb-3">{quiz.title}</h1>
              <div className="flex items-center gap-4 text-sky-100">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{quiz.questions.length} questions</span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              {quiz.questions.map((q, index) => (
                <Card key={q.id} className="hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-10 h-10 bg-sky-100 text-sky-700 rounded-full flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>

                    <div className="flex-1">
                      <Badge type={q.type} />
                      <h3 className="text-lg font-medium text-gray-900 mt-2 mb-4">{q.prompt}</h3>

                      {q.type === "CHECKBOX" ? (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Options:</p>
                          <ul className="space-y-2">
                            {q.options.map((opt, idx) => {
                              // Parse JSON array from backend: "[0,1,2]" -> [0,1,2]
                              let correctIndexes: number[] = [];
                              try {
                                correctIndexes = q.answer ? JSON.parse(q.answer) : [];
                              } catch {
                                correctIndexes = [];
                              }
                              const isCorrect = correctIndexes.includes(idx);
                              return (
                                <li
                                  key={opt.id}
                                  className={`flex items-center gap-2 p-3 rounded-md ${
                                    isCorrect
                                      ? "bg-green-50 border border-green-200"
                                      : "bg-gray-50 border border-gray-200"
                                  }`}
                                >
                                  {isCorrect && (
                                    <svg
                                      className="w-5 h-5 text-green-600 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                      />
                                    </svg>
                                  )}
                                  <span
                                    className={
                                      isCorrect ? "font-medium text-green-900" : "text-gray-700"
                                    }
                                  >
                                    {opt.text}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ) : (
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                          <p className="text-sm font-medium text-green-900">
                            Answer: <span className="font-bold">{q.answer}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
