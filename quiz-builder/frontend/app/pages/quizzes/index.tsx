import Link from "next/link";
import { useEffect, useState } from "react";
import { deleteQuiz, getQuizzes, QuizListItem, getCategories, Category } from "../../services/api";
import { AppLayout } from "../../components/layout/AppLayout";
import { Card } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Alert } from "../../components/ui/Alert";

export default function QuizzesPage() {
  const [items, setItems] = useState<QuizListItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category?.id === selectedCategory)
    : items;

  return (
    <AppLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Quizzes</h1>
            <p className="text-gray-600 mt-1">
              {filteredItems.length} quiz{filteredItems.length !== 1 ? "zes" : ""} {selectedCategory && "in selected category"}
            </p>
          </div>
          <Link href="/create">
            <Button variant="primary">+ New Quiz</Button>
          </Link>
        </div>

        {error && <Alert variant="error" className="mb-6">{error}</Alert>}

        {/* Category Filter */}
        <div className="mb-6 flex items-center gap-3">
          <label htmlFor="category-filter" className="text-sm font-medium text-gray-700">
            Filter by category:
          </label>
          <select
            id="category-filter"
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          {selectedCategory && (
            <Button variant="ghost" size="sm" onClick={() => setSelectedCategory("")}>
              Clear filter
            </Button>
          )}
        </div>

        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-sky-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-sky-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {selectedCategory ? "No quizzes in this category" : "No quizzes yet"}
            </h3>
            <p className="text-gray-600 mb-6">
              {selectedCategory ? "Try selecting a different category" : "Get started by creating your first quiz"}
            </p>
            {!selectedCategory && (
              <Link href="/create">
                <Button variant="primary">Create Quiz</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((q) => (
              <Card key={q.id} hover className="flex flex-col h-full">
                <div className="flex-1">
                  <Link href={`/quizzes/${q.id}`}>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-sky-600 transition-colors cursor-pointer">
                      {q.title}
                    </h3>
                  </Link>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{q.questionCount} questions</span>
                    </div>
                    {q.category && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                        <span>{q.category.icon}</span>
                        <span>{q.category.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
                  <Link href={`/quizzes/${q.id}`} className="flex-1">
                    <Button variant="secondary" size="sm" className="w-full">
                      View Details
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(q.id)}
                    className="text-red-600 hover:bg-red-50"
                    aria-label="Delete quiz"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
