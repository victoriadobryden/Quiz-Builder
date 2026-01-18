import Link from "next/link";
import { ReactNode } from "react";

type AppLayoutProps = {
  children: ReactNode;
};

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/quizzes" className="text-xl font-bold text-sky-600 hover:text-sky-700">
              Quiz Builder
            </Link>
            <div className="flex items-center gap-6">
              <Link href="/quizzes" className="text-gray-700 hover:text-sky-600 transition-colors">
                My Quizzes
              </Link>
              <Link href="/create" className="text-gray-700 hover:text-sky-600 transition-colors">
                Create Quiz
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
