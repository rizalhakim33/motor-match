export interface ArticleHeading {
  level: number;
  text: string;
  slug: string;
}

export default function TableOfContents({
  headings,
}: {
  headings: ArticleHeading[];
}) {
  if (headings.length === 0) return null;

  return (
    <nav className="bg-surface-50 border border-surface-200 rounded-2xl p-5">
      <h2 className="text-sm font-semibold text-surface-900 mb-3">
        Daftar Isi
      </h2>
      <ul className="space-y-1.5">
        {headings.map((heading) => (
          <li
            key={heading.slug}
            style={{ paddingLeft: `${(heading.level - 2) * 16}px` }}
          >
            <a
              href={`#${heading.slug}`}
              className="text-sm text-surface-500 hover:text-primary-600 transition-colors line-clamp-1"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
