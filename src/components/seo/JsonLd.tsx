import type { JsonLdObject } from '../../lib/schema';

export interface JsonLdProps {
  data: JsonLdObject | JsonLdObject[];
}

/**
 * Renders structured data as a JSON-LD script. Rendered inline in the body
 * (valid per Google), so vite-react-ssg bakes it into the static HTML.
 */
export default function JsonLd({ data }: JsonLdProps) {
  const json = JSON.stringify(data);
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}
