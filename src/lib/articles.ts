import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleMetadata, ArticleHeading } from "@/types";

const articlesDir = path.join(process.cwd(), "src", "content", "articles");

function calcReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.replace(/<[^>]*>/g, "").split(/\s+/).length;
  return Math.max(1, Math.ceil(words / wordsPerMinute));
}

function extractHeadings(content: string): ArticleHeading[] {
  const headings: ArticleHeading[] = [];
  const regex = /^(#{2,3})\s+(.+)$/gm;
  let match;

  while ((match = regex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2].replace(/\*\*/g, "").replace(/`/g, "");
    const slug = text
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    headings.push({ level, text, slug });
  }

  return headings;
}

function slugToId(slug: string): string {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export function getAllArticles(): ArticleMetadata[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    return {
      title: data.title || filename.replace(/\.mdx$/, ""),
      slug: data.slug || filename.replace(/\.mdx$/, ""),
      date: data.date || "",
      description: data.description || "",
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      author: data.author || "MotorMatch",
      readingTime: calcReadingTime(content),
      headings: extractHeadings(content),
    };
  });

  return articles.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getArticleBySlug(slug: string) {
  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  for (const filename of files) {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(fileContent);

    const fileSlug = data.slug || filename.replace(/\.mdx$/, "");
    if (fileSlug === slug || filename.replace(/\.mdx$/, "") === slug) {
      return {
        metadata: {
          title: data.title || filename.replace(/\.mdx$/, ""),
          slug: fileSlug,
          date: data.date || "",
          description: data.description || "",
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          author: data.author || "MotorMatch",
          readingTime: calcReadingTime(content),
          headings: extractHeadings(content),
        } as ArticleMetadata,
        content,
      };
    }
  }

  return null;
}

export function getAllArticleSlugs(): string[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return data.slug || filename.replace(/\.mdx$/, "");
  });
}

export function getRelatedArticles(
  currentSlug: string,
  tags: string[],
  limit = 3
): ArticleMetadata[] {
  const allArticles = getAllArticles();

  return allArticles
    .filter((a) => a.slug !== currentSlug)
    .map((a) => ({
      article: a,
      score: a.tags.filter((t) => tags.includes(t)).length,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((item) => item.article);
}
