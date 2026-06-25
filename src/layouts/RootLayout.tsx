import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import Seo from '../components/seo/Seo';
import '../styles.css';
import '../styles/blog.css';

/**
 * Scroll to top on route change; scroll to the target element when navigating
 * to a homepage section from another route (e.g. /#pricing). No-op during SSR.
 */
function useScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        el.scrollIntoView();
        return;
      }
    }
    window.scrollTo(0, 0);
  }, [pathname, hash]);
}

export default function RootLayout() {
  useScrollManager();

  return (
    <div className="page">
      {/* Site-wide fallback. Per-page <Seo> (rendered later in the tree)
          overrides these via react-helmet's last-wins dedup. */}
      <Seo />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <SiteHeader />
      <main id="main">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  );
}
