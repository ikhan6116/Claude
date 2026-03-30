import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const BLOG_DIR = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  category: string;
  tags: string[];
  keywords: string[];
  readingTime: string;
  content: string;
  excerpt: string;
}

export function getAllPostSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => file.replace('.md', ''));
}

export function getPostBySlug(slug: string): BlogPost | null {
  const filePath = path.join(BLOG_DIR, `${slug}.md`);
  if (!fs.existsSync(filePath)) return null;

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);

  const wordCount = content.split(/\s+/).length;
  const readingTime = `${Math.ceil(wordCount / 200)} min read`;

  const excerpt = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[*_`]/g, '')
    .slice(0, 200)
    .trim() + '...';

  return {
    slug,
    title: data.title || '',
    description: data.description || '',
    date: data.date || '',
    author: data.author || 'Freedom Debt Solutions Team',
    category: data.category || 'Debt Relief',
    tags: data.tags || [],
    keywords: data.keywords || [],
    readingTime,
    content,
    excerpt,
  };
}

export async function getPostHtml(content: string): Promise<string> {
  const result = await remark().use(html).process(content);
  return result.toString();
}

export function getAllPosts(): BlogPost[] {
  const slugs = getAllPostSlugs();
  return slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostsByCategory(category: string): BlogPost[] {
  return getAllPosts().filter(
    (post) => post.category.toLowerCase() === category.toLowerCase()
  );
}

export function getRelatedPosts(currentSlug: string, limit: number = 3): BlogPost[] {
  const current = getPostBySlug(currentSlug);
  if (!current) return [];

  return getAllPosts()
    .filter((post) => post.slug !== currentSlug)
    .filter(
      (post) =>
        post.category === current.category ||
        post.tags.some((tag) => current.tags.includes(tag))
    )
    .slice(0, limit);
}
