/* ------------------------------------------------------------------ *
 * Postbuild SEO: generate dist/sitemap.xml from the static routes +
 * MDX content, and produce dist/404.html for GitHub Pages from the
 * pre-rendered 404 route.
 *
 * Plain Node (runs after `vite-react-ssg build`). Keep SITE_URL in sync
 * with src/config/site.ts (a custom domain changes both).
 * ------------------------------------------------------------------ */

import { readdirSync, readFileSync, writeFileSync, existsSync, copyFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import matter from 'gray-matter';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, '..');
const dist = join(root, 'dist');
const blogDir = join(root, 'src', 'content', 'blog');

const SITE_URL = 'https://hrahimi270.github.io/formflow';
const today = new Date().toISOString().slice(0, 10);

if (!existsSync(dist)) {
  console.error('[postbuild-seo] dist/ not found — did the build run?');
  process.exit(1);
}

/* ----- collect routes ----- */
const routes = [
  { loc: '/', priority: '1.0', changefreq: 'weekly', lastmod: today },
  { loc: '/blog', priority: '0.8', changefreq: 'weekly', lastmod: today },
];

const categories = existsSync(blogDir)
  ? readdirSync(blogDir, { withFileTypes: true })
      .filter((d) => d.isDirectory() && !d.name.startsWith('_'))
      .map((d) => d.name)
  : [];

let postCount = 0;
for (const cat of categories) {
  const catPath = join(blogDir, cat);
  routes.push({ loc: `/blog/${cat}`, priority: '0.6', changefreq: 'weekly', lastmod: today });
  for (const entry of readdirSync(catPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const mdx = join(catPath, entry.name, 'index.mdx');
    if (!existsSync(mdx)) continue;
    const { data } = matter(readFileSync(mdx, 'utf8'));
    if (data.draft) continue;
    const slug = data.slug || entry.name;
    const lastmod = data.updatedAt || data.publishedAt || today;
    routes.push({ loc: `/blog/${cat}/${slug}`, priority: '0.7', changefreq: 'monthly', lastmod });
    postCount += 1;
  }
}

/* ----- write sitemap.xml ----- */
const body = routes
  .map((r) => {
    const loc = r.loc === '/' ? `${SITE_URL}/` : `${SITE_URL}${r.loc}`;
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>` : '',
      `    <changefreq>${r.changefreq}</changefreq>`,
      `    <priority>${r.priority}</priority>`,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n');
  })
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
writeFileSync(join(dist, 'sitemap.xml'), xml);

/* ----- produce 404.html for GitHub Pages ----- */
const target = join(dist, '404.html');
const sources = [join(dist, '404', 'index.html'), join(dist, '404.html'), join(dist, 'index.html')];
const source = sources.find(existsSync);
let fourOhFour = 'missing';
if (source && source !== target) {
  copyFileSync(source, target);
  fourOhFour = source.includes(`404${join('', '')}`) || source.includes('404') ? 'from 404 route' : 'fallback to index.html';
} else if (source === target) {
  fourOhFour = 'already present';
}

console.log(
  `[postbuild-seo] sitemap.xml: ${routes.length} urls (${categories.length} categories, ${postCount} posts) · 404.html: ${fourOhFour}`,
);
