#!/usr/bin/env node

/**
 * Sitemap Generator
 * Generates sitemap.xml for all pages and blog posts
 */

const fs = require('fs');
const path = require('path');

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://freedomdebtsolutions.com';
const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog');
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/get-started', priority: '0.9', changefreq: 'monthly' },
  { path: '/debt-consolidation', priority: '0.9', changefreq: 'monthly' },
  { path: '/debt-relief', priority: '0.9', changefreq: 'monthly' },
  { path: '/credit-card-debt-help', priority: '0.8', changefreq: 'monthly' },
  { path: '/medical-debt-relief', priority: '0.8', changefreq: 'monthly' },
  { path: '/about', priority: '0.6', changefreq: 'monthly' },
  { path: '/blog', priority: '0.8', changefreq: 'daily' },
];

function getBlogSlugs() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter(f => f.endsWith('.md'))
    .map(f => f.replace('.md', ''));
}

function generateSitemap() {
  const today = new Date().toISOString().split('T')[0];
  const blogSlugs = getBlogSlugs();

  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n';
  xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

  // Static pages
  STATIC_PAGES.forEach(page => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}${page.path}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>${page.changefreq}</changefreq>\n`;
    xml += `    <priority>${page.priority}</priority>\n`;
    xml += `  </url>\n`;
  });

  // Blog posts
  blogSlugs.forEach(slug => {
    xml += `  <url>\n`;
    xml += `    <loc>${SITE_URL}/blog/${slug}</loc>\n`;
    xml += `    <lastmod>${today}</lastmod>\n`;
    xml += `    <changefreq>monthly</changefreq>\n`;
    xml += `    <priority>0.7</priority>\n`;
    xml += `  </url>\n`;
  });

  xml += '</urlset>';

  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  fs.writeFileSync(path.join(PUBLIC_DIR, 'sitemap.xml'), xml, 'utf8');
  console.log(`Sitemap generated: ${STATIC_PAGES.length + blogSlugs.length} URLs`);
}

generateSitemap();
