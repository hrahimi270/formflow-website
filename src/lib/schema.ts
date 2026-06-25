/* ------------------------------------------------------------------ *
 * JSON-LD builders. Each returns a plain object; JSON.stringify drops
 * undefined keys, so optional fields are simply omitted. All URLs are
 * absolute and all dates ISO 8601 (Google requirements).
 * ------------------------------------------------------------------ */

import type { Post } from './content';
import {
  SITE_URL,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  ORG,
  absoluteUrl,
  canonicalUrl,
} from '../config/site';

export type JsonLdObject = Record<string, unknown>;

function toIso(date: string): string {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? date : d.toISOString();
}

export function organizationSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: ORG.name,
    url: `${SITE_URL}/`,
    logo: ORG.logo,
    sameAs: ORG.sameAs,
  };
}

export function websiteSchema(): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    alternateName: `${SITE_NAME} — ${SITE_TAGLINE}`,
    url: `${SITE_URL}/`,
    description: SITE_DESCRIPTION,
  };
}

export function blogSchema(description?: string): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    name: `${SITE_NAME} Blog`,
    url: canonicalUrl('/blog'),
    description: description ?? `Tutorials, guides and product updates for ${SITE_NAME}.`,
    publisher: {
      '@type': 'Organization',
      name: ORG.name,
      logo: { '@type': 'ImageObject', url: ORG.logo },
    },
  };
}

export function collectionPageSchema(opts: {
  name: string;
  description: string;
  path: string;
  posts: Post[];
}): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: opts.name,
    description: opts.description,
    url: canonicalUrl(opts.path),
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: opts.posts.map((p, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        url: canonicalUrl(p.path),
        name: p.frontmatter.title,
      })),
    },
  };
}

export function blogPostingSchema(post: Post): JsonLdObject {
  const url = canonicalUrl(post.path);
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.frontmatter.title,
    description: post.frontmatter.description,
    image: post.ogImageUrl ? [absoluteUrl(post.ogImageUrl)] : undefined,
    datePublished: toIso(post.frontmatter.publishedAt),
    dateModified: toIso(post.frontmatter.updatedAt ?? post.frontmatter.publishedAt),
    // No author by design; publisher carries the brand.
    publisher: {
      '@type': 'Organization',
      name: ORG.name,
      logo: { '@type': 'ImageObject', url: ORG.logo },
    },
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    articleSection: post.category.name,
    keywords: post.frontmatter.tags?.length ? post.frontmatter.tags.join(', ') : undefined,
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]): JsonLdObject {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function howToSchema(post: Post): JsonLdObject | null {
  const s = post.frontmatter.schema;
  if (s?.type !== 'HowTo' || !s.steps?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: post.frontmatter.title,
    description: post.frontmatter.description,
    image: post.ogImageUrl ? absoluteUrl(post.ogImageUrl) : undefined,
    step: s.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  };
}

export function faqSchema(post: Post): JsonLdObject | null {
  const s = post.frontmatter.schema;
  if (s?.type !== 'FAQPage' || !s.faq?.length) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: s.faq.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };
}
