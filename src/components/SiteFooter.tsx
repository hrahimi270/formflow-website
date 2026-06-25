import { Link } from 'react-router-dom';
import { REPO_URL, SDK_REPO_URL, NPM_URL } from '../config/site';
import { getCategories } from '../lib/content';

const LOGO = `${import.meta.env.BASE_URL}logo.png`;

export default function SiteFooter() {
  const categories = getCategories();

  return (
    <footer className="footer">
      <div className="footer-brand">
        <Link to="/" className="brand">
          <img className="brand-logo" src={LOGO} alt="" width={28} height={28} />
          <span className="brand-word">FormFlow</span>
        </Link>
        <p>Strapi forms without the glue code.</p>
      </div>
      <nav className="footer-cols" aria-label="Footer">
        <div className="footer-col">
          <h4>Plugin</h4>
          <a href={NPM_URL} target="_blank" rel="noreferrer">
            npm package
          </a>
          <a href={REPO_URL} target="_blank" rel="noreferrer">
            GitHub repo
          </a>
          <a href={`${REPO_URL}/issues`} target="_blank" rel="noreferrer">
            Issues
          </a>
        </div>
        <div className="footer-col">
          <h4>SDKs</h4>
          <a href="https://www.npmjs.com/package/@formflowjs/react" target="_blank" rel="noreferrer">
            @formflowjs/react
          </a>
          <a href="https://www.npmjs.com/package/@formflowjs/vue" target="_blank" rel="noreferrer">
            @formflowjs/vue
          </a>
          <a href={SDK_REPO_URL} target="_blank" rel="noreferrer">
            SDK repo
          </a>
        </div>
        <div className="footer-col">
          <h4>Blog</h4>
          <Link to="/blog">Latest posts</Link>
          {categories.map((c) => (
            <Link key={c.slug} to={`/blog/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
      <p className="footer-legal">
        Open-core. Free core under MIT; premium features under the FormFlow EE license.
      </p>
    </footer>
  );
}
