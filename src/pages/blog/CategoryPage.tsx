import { useParams } from 'react-router-dom';
import Seo from '../../components/seo/Seo';
import JsonLd from '../../components/seo/JsonLd';
import Breadcrumbs from '../../components/blog/Breadcrumbs';
import PostCard from '../../components/blog/PostCard';
import { CategoryFilter } from '../../components/blog/CategoryPill';
import { NotFoundView } from '../NotFound';
import { getAllPosts, getCategories, getCategory, getPostsByCategory } from '../../lib/content';
import { collectionPageSchema } from '../../lib/schema';

export function Component() {
  const { category: slug } = useParams();
  const category = slug ? getCategory(slug) : undefined;

  if (!category) {
    return (
      <NotFoundView
        title="Category not found"
        message="That category doesn't exist. Browse all posts instead."
      />
    );
  }

  const posts = getPostsByCategory(category.slug);
  const categories = getCategories();
  const allPosts = getAllPosts();
  const counts = Object.fromEntries(
    categories.map((c) => [c.slug, allPosts.filter((p) => p.categorySlug === c.slug).length]),
  );
  const path = `/blog/${category.slug}`;

  return (
    <div className="blog">
      <Seo title={category.name} description={category.description} />
      <JsonLd
        data={collectionPageSchema({
          name: category.title,
          description: category.description,
          path,
          posts,
        })}
      />
      <Breadcrumbs
        items={[
          { name: 'Home', path: '/' },
          { name: 'Blog', path: '/blog' },
          { name: category.name, path },
        ]}
      />
      <header className="blog-header">
        <h1>{category.name}</h1>
        <p className="blog-lede">{category.description}</p>
      </header>

      <CategoryFilter categories={categories} activeSlug={category.slug} counts={counts} />

      <h2 className="sr-only">Posts in {category.name}</h2>
      {posts.length === 0 ? (
        <p className="blog-empty">No posts in this category yet — check back soon.</p>
      ) : (
        <div className="post-grid">
          {posts.map((p) => (
            <PostCard key={p.path} post={p} />
          ))}
        </div>
      )}
    </div>
  );
}
