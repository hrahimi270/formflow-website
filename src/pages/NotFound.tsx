import { Link } from 'react-router-dom';
import Seo from '../components/seo/Seo';

export interface NotFoundViewProps {
  title?: string;
  message?: string;
}

export function NotFoundView({ title = 'Page not found', message }: NotFoundViewProps) {
  return (
    <div className="blog">
      <Seo title={title} noindex />
      <header className="blog-header">
        <h1>{title}</h1>
        <p className="blog-lede">
          {message ?? "The page you're looking for doesn't exist or has moved."}
        </p>
      </header>
      <div className="hero-actions">
        <Link className="btn btn-primary" to="/blog">
          Browse the blog
        </Link>
        <Link className="btn btn-ghost" to="/">
          Back home
        </Link>
      </div>
    </div>
  );
}

export function Component() {
  return <NotFoundView />;
}
