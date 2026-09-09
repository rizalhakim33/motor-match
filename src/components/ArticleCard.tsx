import Link from "next/link";
import type { ArticleMetadata } from "@/types";

export default function ArticleCard({ article }: { article: ArticleMetadata }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block bg-white rounded-2xl shadow-soft border border-surface-200/70 p-6 hover:shadow-medium hover:border-primary-200 transition-all"
    >
      <div className="flex items-center gap-2 flex-wrap mb-3">
        {article.tags.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full font-medium"
          >
            {tag}
          </span>
        ))}
      </div>

      <h2 className="text-lg font-semibold text-surface-900 group-hover:text-primary-700 transition-colors leading-snug">
        {article.title}
      </h2>

      <p className="mt-2 text-sm text-surface-500 line-clamp-2 leading-relaxed">
        {article.description}
      </p>

      <div className="mt-4 flex items-center gap-3 text-xs text-surface-400">
        <time dateTime={article.date}>
          {new Date(article.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </time>
        {article.readingTime && (
          <>
            <span className="text-surface-300">&middot;</span>
            <span>{article.readingTime} menit baca</span>
          </>
        )}
      </div>
    </Link>
  );
}
