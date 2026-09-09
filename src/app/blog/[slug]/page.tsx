import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllArticleSlugs, getArticleBySlug } from "@/lib/articles";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://motormatch.my.id";

export async function generateStaticParams() {
  const slugs = getAllArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) return {};

  const { metadata } = article;

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.tags,
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
      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <header>
          <div className="flex items-center gap-2 flex-wrap mb-4">
            {metadata.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-surface-900">
            {metadata.title}
          </h1>
          <p className="mt-3 text-surface-500">{metadata.description}</p>
          <time
            dateTime={metadata.date}
            className="block mt-2 text-sm text-surface-400"
          >
            {new Date(metadata.date).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </time>
        </header>

        <div className="mt-8 prose prose-surface max-w-none prose-headings:scroll-mt-20 prose-a:text-primary-600 prose-code:text-primary-700 prose-pre:bg-surface-100 prose-pre:border prose-pre:border-surface-200">
          <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
        </div>

        <footer className="mt-12 pt-6 border-t border-surface-200">
          <a
            href="/blog"
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            &larr; Kembali ke Blog
          </a>
        </footer>
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

  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, (_, lang, code) => {
    return `<pre class="language-${lang}"><code>${escapeHtml(code.trim())}</code></pre>`;
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');

  // Bold & italic
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

  // Horizontal rule
  html = html.replace(/^---$/gm, "<hr />");

  // Blockquote
  html = html.replace(/^> (.+)$/gm, "<blockquote>$1</blockquote>");

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
        trimmed.startsWith("<blockquote")
      ) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, "<br />")}</p>`;
    })
    .join("\n");

  // Lists
  html = html.replace(/^- (.+)$/gm, "<li>$1</li>");
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);

  // Numbered lists
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
