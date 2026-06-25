import { Head } from 'vite-react-ssg';
import { useLocation } from 'react-router-dom';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  canonicalUrl,
  absoluteUrl,
  defaultOgImage,
} from '../../config/site';

export interface SeoProps {
  /** Page title (brand is appended). Omit on the homepage for the tagline title. */
  title?: string;
  description?: string;
  /** Image URL (absolute or root-relative). Defaults to the site OG card. */
  image?: string;
  /** Override the canonical URL. Defaults to the current pathname. */
  canonical?: string;
  type?: 'website' | 'article';
  noindex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
}

/**
 * Per-route document head. Uses vite-react-ssg's <Head> so tags are captured
 * during static pre-render (real HTML for crawlers and AI), and kept in sync
 * on client-side navigation.
 */
export default function Seo({
  title,
  description,
  image,
  canonical,
  type = 'website',
  noindex = false,
  publishedTime,
  modifiedTime,
}: SeoProps) {
  const { pathname } = useLocation();
  const url = canonical ?? canonicalUrl(pathname);
  const desc = description ?? SITE_DESCRIPTION;
  const fullTitle = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — ${SITE_TAGLINE}`;
  const socialTitle = title ?? `${SITE_NAME} — ${SITE_TAGLINE}`;
  const ogImage = image ? absoluteUrl(image) : defaultOgImage(import.meta.env.BASE_URL);

  return (
    <Head>
      <title>{fullTitle}</title>
      <meta name="description" content={desc} />
      <link rel="canonical" href={url} />
      {noindex ? <meta name="robots" content="noindex,follow" /> : null}

      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={desc} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={socialTitle} />
      <meta name="twitter:description" content={desc} />
      <meta name="twitter:image" content={ogImage} />

      {type === 'article' && publishedTime ? (
        <meta property="article:published_time" content={publishedTime} />
      ) : null}
      {type === 'article' && modifiedTime ? (
        <meta property="article:modified_time" content={modifiedTime} />
      ) : null}
    </Head>
  );
}
