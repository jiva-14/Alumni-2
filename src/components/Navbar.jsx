import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { Icon } from './ui';
import BrandLogo from './BrandLogo';
import '../styles/navbar.css';

// Replace with the real paths used in your App.jsx routes.
const DEFAULT_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/alumni', label: 'Alumni' },
  { to: '/events', label: 'Events' },
  { to: '/blog', label: 'Articles' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/community', label: 'Community' },
];

export default function Navbar({
  brand = 'MPGI',
  links = DEFAULT_LINKS,
  user = null,            // pass your logged-in user object, or null
  dashboardPath = '/dashboard',
  loginPath = '/login',
  onLogout,
}) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);

  return (
    <header className="nav">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="container nav__inner">
        <Link to="/" className="nav__brand" aria-label="MPGI Alumni Portal, home">
          <BrandLogo size={46} priority />
          <span className="nav__brandtext"><strong>MPGI Alumni Portal</strong><small>Maharana Pratap Group of Institutions</small></span>
        </Link>

        <button className="nav__toggle" onClick={() => setOpen((v) => !v)}
          aria-expanded={open} aria-controls="nav-panel" aria-label={open ? 'Close menu' : 'Open menu'}>
          <Icon name={open ? 'close' : 'menu'} size={24} />
        </button>

        <nav id="nav-panel" className={`nav__panel${open ? ' open' : ''}`} aria-label="Main">
          <ul className="nav__links">
            {links.map((l) => (
              <li key={l.to}>
                <NavLink to={l.to} end={l.end} className={({ isActive }) => `nav__link${isActive ? ' active' : ''}`}>
                  {l.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <div className="nav__actions">
            {user ? (
              <>
                <Link to={dashboardPath} className="btn btn--outline btn--sm">Dashboard</Link>
                {onLogout && <button className="btn btn--ghost btn--sm" onClick={onLogout}>Log out</button>}
              </>
            ) : (
              <Link to={loginPath} className="btn btn--primary btn--sm">Log in</Link>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
