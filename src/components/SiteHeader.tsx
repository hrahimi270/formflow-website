import { Link, NavLink, useLocation } from 'react-router-dom';
import { REPO_URL } from '../config/site';

const LOGO = `${import.meta.env.BASE_URL}logo.png`;

// In-page section anchors on the landing page. On other routes these become
// links back to the homepage section (Link with a hash) so the SPA stays intact.
const sectionLinks = [
  { href: '#pipeline', label: 'How it works' },
  { href: '#admin', label: 'Screenshots' },
  { href: '#sdks', label: 'SDKs' },
  { href: '#pricing', label: 'Pricing' },
  { href: '#install', label: 'Install' },
];

export default function SiteHeader() {
  const { pathname } = useLocation();
  const isHome = pathname === '/';

  return (
    <header className="nav">
      {isHome ? (
        <a href="#top" className="brand" aria-label="FormFlow home">
          <img className="brand-logo" src={LOGO} alt="" width={28} height={28} />
          <span className="brand-word">FormFlow</span>
        </a>
      ) : (
        <Link to="/" className="brand" aria-label="FormFlow home">
          <img className="brand-logo" src={LOGO} alt="" width={28} height={28} />
          <span className="brand-word">FormFlow</span>
        </Link>
      )}

      <nav className="nav-links" aria-label="Sections">
        {sectionLinks.map((link) =>
          isHome ? (
            <a key={link.href} href={link.href}>
              {link.label}
            </a>
          ) : (
            <Link key={link.href} to={{ pathname: '/', hash: link.href }}>
              {link.label}
            </Link>
          ),
        )}
        <NavLink to="/blog" className={({ isActive }) => (isActive ? 'is-active' : undefined)}>
          Blog
        </NavLink>
      </nav>

      <div className="nav-actions">
        <a className="nav-ghost" href={REPO_URL} target="_blank" rel="noreferrer">
          GitHub
        </a>
        {isHome ? (
          <a className="nav-cta" href="#install">
            Install
          </a>
        ) : (
          <Link className="nav-cta" to={{ pathname: '/', hash: '#install' }}>
            Install
          </Link>
        )}
      </div>
    </header>
  );
}
