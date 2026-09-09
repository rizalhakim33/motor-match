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
              className="text-surface-500 hover:text-surface-900 transition-colors"
            >
              Blog
            </Link>
          </div>
        </div>
      </nav>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        {/* Back Link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-1 text-sm text-surface-400 hover:text-surface-600 transition-colors mb-6"
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

        {/* Meta */}
        <div className="flex items-center gap-3 text-sm mb-4">
          {metadata.tags.length > 0 && (
            <span className="bg-primary-100 text-primary-700 px-2.5 py-0.5 rounded-md text-xs font-medium">
              {metadata.tags[0]}
            </span>
          )}
          <span className="text-surface-400">
            {new Date(metadata.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </span>
          <span className="text-surface-300">&middot;</span>
          <span className="text-surface-400">{metadata.readingTime} menit</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-extrabold tracking-tight text-surface-900 leading-[1.15]">
          {metadata.title}
        </h1>

        {/* Featured Image Placeholder */}
        <div className="mt-8 bg-primary-50 rounded-2xl aspect-[2/1] flex items-center justify-center">
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo.png"
              alt="MotorMatch"
              className="w-16 h-16 mx-auto mb-2 opacity-60"
            />
            <span className="text-sm text-primary-400 font-medium">
              MotorMatch Blog
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="mt-10 prose prose-surface max-w-none prose-headings:scroll-mt-24 prose-h2:text-[22px] prose-h2:font-bold prose-h2:text-surface-900 prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-[17px] prose-h3:font-semibold prose-h3:text-surface-800 prose-h3:mt-8 prose-h3:mb-3 prose-p:text-[17px] prose-p:leading-[1.8] prose-p:text-surface-600 prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline prose-strong:text-surface-900 prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-normal prose-pre:bg-surface-900 prose-pre:text-surface-100 prose-pre:rounded-xl prose-li:text-surface-600 prose-li:marker:text-primary-400 prose-li:text-[17px] prose-li:leading-[1.8] prose-blockquote:border-primary-300 prose-blockquote:bg-primary-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-blockquote:not-italic prose-hr:border-surface-200 prose-table:text-sm prose-th:text-left prose-th:font-semibold prose-th:text-surface-700 prose-th:py-3 prose-th:px-4 prose-th:bg-surface-50 prose-td:py-3 prose-td:px-4 prose-td:text-surface-600 prose-td:border-surface-100">
          <div
            dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }}
          />
        </div>

        {/* Author + CTA */}
        <div className="mt-12 pt-8 border-t border-surface-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="text-sm text-surface-500">
            Ditulis oleh{" "}
            <span className="font-medium text-surface-700">
              {metadata.author || "MotorMatch"}
            </span>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Coba MotorMatch Gratis
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
              />
            </svg>
          </Link>
        </div>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <section className="mt-16 pt-8 border-t border-surface-200">
            <h2 className="text-xl font-bold text-surface-900 mb-6">
              Artikel Terkait
            </h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedArticles.map((related) => (
                <ArticleCard key={related.slug} article={related} />
              ))}
            </div>
          </section>
        )}
      </article>

      {/* Footer */}
      <footer className="border-t border-surface-100 mt-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-surface-400">
          <p>&copy; {new Date().getFullYear()} MotorMatch. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/blog" className="hover:text-surface-600 transition-colors">
              Blog
            </Link>
          </div>
        </div>
      </footer>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </div>
  );
}

function renderMarkdown(content: string): string {
  let html = content;

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

      return `<div class="overflow-x-auto"><table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table></div>`;
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
