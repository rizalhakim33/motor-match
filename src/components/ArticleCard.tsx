import Link from "next/link";
import type { ArticleMetadata } from "@/types";

export default function ArticleCard({ article }: { article: ArticleMetadata }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="group block py-6 border-b border-surface-100 last:border-0"
    >
      <div className="flex items-center gap-3 text-sm mb-3">
        {article.tags.length > 0 && (
          <span className="bg-primary-100 text-primary-700 px-2.5 py-0.5 rounded-md text-xs font-medium">
            {article.tags[0]}
          </span>
        )}
        <span className="text-surface-400">
          {new Date(article.date).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
        {article.readingTime && (
          <>
            <span className="text-surface-300">&middot;</span>
            <span className="text-surface-400">{article.readingTime} menit</span>
          </>
        )}
      </div>

      <h2 className="text-xl sm:text-2xl font-bold text-surface-900 group-hover:text-primary-600 transition-colors leading-snug">
        {article.title}
      </h2>

      <p className="mt-2 text-surface-500 leading-relaxed line-clamp-2">
        {article.description}
      </p>
    </Link>
  );
}
