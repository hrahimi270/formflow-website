import Seo from '../../components/seo/Seo';
import JsonLd from '../../components/seo/JsonLd';
import Breadcrumbs from '../../components/blog/Breadcrumbs';
import PostCard from '../../components/blog/PostCard';
import { CategoryFilter } from '../../components/blog/CategoryPill';
import { getAllPosts, getCategories, getFeaturedPosts } from '../../lib/content';
import { blogSchema, collectionPageSchema } from '../../lib/schema';
import { SITE_NAME } from '../../config/site';

const BLOG_LEDE =
  'Tutorials, guides and product updates for building headless forms with Strapi v5.';

export function Component() {
  const posts = getAllPosts();
  const categories = getCategories();
  const featured = getFeaturedPosts()[0];
  const rest = posts.filter((p) => p !== featured);
  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, posts.filter((p) => p.categorySlug === c.slug).length]),
  );

  return (
    <div className="blog">
      <Seo title="Blog" description={BLOG_LEDE} />
      <JsonLd
        data={[
          blogSchema(BLOG_LEDE),
          collectionPageSchema({
            name: `${SITE_NAME} Blog`,
            description: BLOG_LEDE,
            path: '/blog',
            posts,
          }),
        ]}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
        ]}
      />
      <header className="blog-header">
        <h1>The FormFlow blog</h1>
        <p className="blog-lede">{BLOG_LEDE}</p>
      </header>

      <CategoryFilter categories={categories} counts={counts} />

      <h2 className="sr-only">All posts</h2>
      {posts.length === 0 ? (
        <p className="blog-empty">No posts yet — check back soon.</p>
      ) : (
        <div className="post-grid">
          {featured ? <PostCard post={featured} featured /> : null}
          {rest.map((p) => (
            <PostCard key={p.path} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
