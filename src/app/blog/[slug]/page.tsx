import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllArticleSlugs,
  getArticleBySlug,
  getRelatedArticles,
} from "@/lib/articles";
import TableOfContents from "@/components/article/TableOfContents";
import Breadcrumbs from "@/components/article/Breadcrumbs";
import ArticleCard from "@/components/ArticleCard";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motormatch.my.id";

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { metadata } = article;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: [...metadata.tags, "sizing motor", "kalkulator motor"],
    alternates: {
      canonical: `/blog/${metadata.slug}`,
    },
    openGraph: {
      type: "article",
      title: metadata.title,
      description: metadata.description,
      url: `${siteUrl}/blog/${metadata.slug}`,
      publishedTime: metadata.date,
      authors: [metadata.author || "MotorMatch"],
      tags: metadata.tags,
    },
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  const { metadata, content } = article;
  const relatedArticles = getRelatedArticles(metadata.slug, metadata.tags);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: metadata.title,
    description: metadata.description,
    datePublished: metadata.date,
    author: {
      "@type": "Organization",
      name: metadata.author || "MotorMatch",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "MotorMatch",
      url: siteUrl,
      logo: {
        "@type": "ImageObject",
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteUrl}/blog/${metadata.slug}`,
    },
    keywords: metadata.tags.join(", "),
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <article className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Breadcrumbs */}
        <div className="mb-6">
          <Breadcrumbs
            items={[
              { label: "Beranda", href: "/" },
              { label: "Blog", href: "/blog" },
              { label: metadata.title },
            ]}
          />
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_220px] lg:gap-8">
          {/* Main Content */}
          <div>
            {/* Header */}
            <header>
              <div className="flex items-center gap-2 flex-wrap mb-4">
                {metadata.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900 leading-tight">
                {metadata.title}
              </h1>

              <p className="mt-3 text-lg text-surface-500 leading-relaxed">
                {metadata.description}
              </p>

              <div className="mt-4 flex items-center gap-4 text-sm text-surface-400">
                <time dateTime={metadata.date}>
                  {new Date(metadata.date).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </time>
                <span className="text-surface-300">&middot;</span>
                <span>{metadata.readingTime} menit baca</span>
              </div>
            </header>

            {/* Divider */}
            <div className="mt-8 border-t border-surface-200" />

            {/* Article Body */}
            <div className="mt-8 prose prose-surface max-w-none prose-headings:scroll-mt-24 prose-h2:text-xl prose-h2:font-bold prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-base prose-h3:font-semibold prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-p:text-surface-600 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-900 prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-pre:bg-surface-900 prose-pre:text-surface-100 prose-pre:rounded-xl prose-pre:border prose-pre:border-surface-800 prose-li:text-surface-600 prose-li:marker:text-primary-400 prose-blockquote:border-primary-300 prose-blockquote:bg-primary-50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic prose-hr:border-surface-200 prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:text-surface-700 prose-th:py-2 prose-th:px-3 prose-td:py-2 prose-td:px-3 prose-td:text-surface-600">
              <div
                dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
              />
            </div>

            {/* Footer */}
            <footer className="mt-12 pt-6 border-t border-surface-200">
              <Link
                href="/blog"
                className="text-sm text-primary-600 hover:text-primary-700 inline-flex items-center gap-1"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                  />
                </svg>
                Kembali ke Blog
              </Link>
            </footer>
          </div>

          {/* Sidebar — TOC (desktop only) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24">
              {metadata.headings && metadata.headings.length > 0 && (
                <TableOfContents headings={metadata.headings} />
              )}
            </div>
          </aside>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-surface-200">
            <h2 className="text-xl font-bold text-surface-900 mb-6">
              Artikel Terkait
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </section>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

function renderMarkdown(content: string): string {
  let html = content;

  // Extract heading IDs for TOC linking
  const headingMap = new Map<string, string>();

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<div class="relative"><pre class="language-${lang}"><code>${escapeHtml(code.trim())}</code></pre></div>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers with slug IDs
  html = html.replace(/^### (.+)$/gm, (_, text) => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return `<h3 id="${slug}">${text}</h3>`;
  });
  html = html.replace(/^## (.+)$/gm, (_, text) => {
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
    return `<h2 id="${slug}">${text}</h2>`;
  });

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2">$1</a>'
  );

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote><p>$1</p></blockquote>");

  // Tables
  html = html.replace(
    /^\|(.+)\|\n\|[-| ]+\|\n((\|.+\|\n?)+)/gm,
    (_, header, body) => {
      const headers = header
        .split("|")
        .map((h: string) => h.trim())
        .filter(Boolean);
      const rows = body
        .trim()
        .split("\n")
        .map((row: string) =>
          row
            .split("|")
            .map((c: string) => c.trim())
            .filter(Boolean)
        );

      const headerHtml = headers
        .map((h: string) => `<th>${h}</th>`)
        .join("");
      const bodyHtml = rows
        .map(
          (row: string[]) =>
            `<tr>${row.map((c: string) => `<td>${c}</td>`).join("")}</tr>`
        )
        .join("");

      return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
    }
  );

  // Paragraphs (lines not already wrapped in block elements)
  html = html
    .split("\n\n")
    .map((block) => {
      const trimmed = block.trim();
      if (!trimmed) return "";
      if (
        trimmed.startsWith("<h") ||
        trimmed.startsWith("<pre") ||
        trimmed.startsWith("<hr") ||
        trimmed.startsWith("<blockquote") ||
        trimmed.startsWith("<table") ||
        trimmed.startsWith("<div")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");

  return html;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
