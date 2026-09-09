import Link from "next/link";
import type { ArticleMetadata } from "@/types";

export default function ArticleCard({ article }: { article: ArticleMetadata }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block bg-white rounded-2xl shadow-soft border border-surface-200/70 p-6 hover:shadow-medium transition-shadow"
    >
      <h2 className="text-lg font-semibold text-surface-900 hover:text-primary-700 transition-colors">
        {article.title}
      </h2>
      <p className="mt-2 text-sm text-surface-500 line-clamp-2">
        {article.description}
      </p>
      <div className="mt-4 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-surface-400">
          {new Date(article.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </span>
        {article.tags.slice(0, 3).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
          >
            {tag}
          </span>
        ))}
      </div>
    </Link>
  );
}
