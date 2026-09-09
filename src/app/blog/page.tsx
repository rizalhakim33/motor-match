import type { Metadata } from "next";
import Link from "next/link";
import { getAllArticles } from "@/lib/articles";
import ArticleCard from "@/components/ArticleCard";

export const metadata: Metadata = {
  title: "Blog - Artikel Tutorial & Tips Sizing Motor",
  description:
    "Artikel tutorial, tips, dan panduan sizing motor servo, stepper, dan induksi. Pelajari formula dan best practices untuk automation engineering.",
  alternates: {
    canonical: "/blog",
  },
};

export default function BlogPage() {
  const articles = getAllArticles();

  return (
    <div className="min-h-screen bg-white">
      {/* Header Nav */}
      <nav className="border-b border-surface-100">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="MotorMatch" className="h-7 w-7" />
            <span className="font-bold text-surface-900">MotorMatch</span>
          </Link>
          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-surface-500 hover:text-surface-900 transition-colors"
            >
              Beranda
            </Link>
            <Link
              href="/blog"
              className="text-surface-900 font-medium"
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-surface-900">
          Blog
        </h1>
        <p className="mt-3 text-lg text-surface-500">
          Artikel tutorial, tips, dan panduan sizing motor untuk engineer
          automation.
        </p>

        {articles.length === 0 ? (
          <p className="mt-12 text-surface-400 text-center py-12">
            Belum ada artikel. Artikel baru akan segera hadir.
          </p>
        ) : (
          <div className="mt-10 grid gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-surface-100 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between text-sm text-surface-400">
          <p>&copy; {new Date().getFullYear()} MotorMatch. All rights reserved.</p>
          <Link href="/" className="hover:text-surface-600 transition-colors">
            Beranda
          </Link>
        </div>
      </footer>
    </div>
  );
}
