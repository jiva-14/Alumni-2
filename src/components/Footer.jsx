import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Footer({
  brand = 'Alumni Portal',
  tagline = 'Connecting graduates with each other and with their university.',
  columns = [
    { title: 'Explore', links: [{ to: '/alumni', label: 'Alumni directory' }, { to: '/events', label: 'Events' }, { to: '/blog', label: 'Blog' }] },
    { title: 'Connect', links: [{ to: '/community', label: 'Community' }, { to: '/gallery', label: 'Gallery' }, { to: '/login', label: 'Log in' }] },
  ],
}) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <h4>{brand}</h4>
          <p>{tagline}</p>
        </div>
        {columns.map((col) => (
          <nav key={col.title} aria-label={col.title}>
            <h4>{col.title}</h4>
            <ul>{col.links.map((l) => <li key={l.to}><Link to={l.to}>{l.label}</Link></li>)}</ul>
          </nav>
        ))}
      </div>
      <div className="footer__bar">
        <div className="container">© {new Date().getFullYear()} {brand}. All rights reserved.</div>
      </div>
    </footer>
  );
}
