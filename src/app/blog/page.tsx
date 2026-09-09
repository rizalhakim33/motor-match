import type { Metadata } from "next";
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
    <div className="min-h-screen bg-surface-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <h1 className="text-3xl font-bold tracking-tight text-surface-900">
          Blog
        </h1>
        <p className="mt-2 text-surface-500">
          Artikel tutorial, tips, dan panduan sizing motor untuk engineer
          automation.
        </p>

        {articles.length === 0 ? (
          <p className="mt-8 text-surface-400">
            Belum ada artikel. Artikel baru akan segera hadir.
          </p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
