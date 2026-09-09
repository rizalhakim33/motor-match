import fs from "fs";
import path from "path";
import matter from "gray-matter";
import type { ArticleMetadata } from "@/types";

const articlesDir = path.join(process.cwd(), "src", "content", "articles");

export function getAllArticles(): ArticleMetadata[] {
  if (!fs.existsSync(articlesDir)) return [];

  const files = fs.readdirSync(articlesDir).filter((f) => f.endsWith(".mdx"));

  const articles = files.map((filename) => {
    const filePath = path.join(articlesDir, filename);
    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);

    return {
      title: data.title || filename.replace(/\.mdx$/, ""),
      slug: data.slug || filename.replace(/\.mdx$/, ""),
      date: data.date || "",
      description: data.description || "",
      tags: data.tags || [],
      thumbnail: data.thumbnail,
      author: data.author || "MotorMatch",
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

    if (data.slug === slug || filename.replace(/\.mdx$/, "") === slug) {
      return {
        metadata: {
          title: data.title || filename.replace(/\.mdx$/, ""),
          slug: data.slug || filename.replace(/\.mdx$/, ""),
          date: data.date || "",
          description: data.description || "",
          tags: data.tags || [],
          thumbnail: data.thumbnail,
          author: data.author || "MotorMatch",
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
