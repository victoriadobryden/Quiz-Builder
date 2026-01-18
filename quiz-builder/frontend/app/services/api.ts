const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";

export type Category = {
  id: string;
  name: string;
  slug: string;
  icon: string | null;
};

export type QuizListItem = {
  id: string;
  title: string;
  questionCount: number;
  category: Category | null;
};

export type QuizDetail = {
  id: string;
  title: string;
  category: Category | null;
  questions: Array<{
    id: string;
    type: "BOOLEAN" | "INPUT" | "CHECKBOX";
    prompt: string;
    answer: string | null;
    options: Array<{ id: string; text: string }>;
  }>;
};

export async function getQuizzes(): Promise<QuizListItem[]> {
  const res = await fetch(`${API_BASE}/quizzes`);
  if (!res.ok) throw new Error("Failed to load quizzes");
  return res.json();
}

export async function getQuiz(id: string): Promise<QuizDetail> {
  const res = await fetch(`${API_BASE}/quizzes/${id}`);
  if (!res.ok) throw new Error("Failed to load quiz");
  return res.json();
}

export async function createQuiz(payload: any) {
  const res = await fetch(`${API_BASE}/quizzes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data?.message || "Failed to create quiz");
  }
  return res.json();
}

export async function deleteQuiz(id: string) {
  const res = await fetch(`${API_BASE}/quizzes/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete quiz");
}

export async function getCategories(): Promise<Category[]> {
  const res = await fetch(`${API_BASE}/categories`);
  if (!res.ok) throw new Error("Failed to load categories");
  return res.json();
}
