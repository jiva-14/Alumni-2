import { Link } from 'react-router-dom';
import BrandLogo from './BrandLogo';
import '../styles/home.css';

export default function Footer({
  brand = 'MPGI Alumni Portal',
  tagline = 'The alumni network of Maharana Pratap Group of Institutions: reconnect, celebrate achievements and discover opportunities.',
  columns = [
    { title: 'Explore', links: [{ to: '/alumni', label: 'Alumni directory' }, { to: '/events', label: 'Events' }, { to: '/blog', label: 'Articles' }] },
    { title: 'Connect', links: [{ to: '/community', label: 'Community' }, { to: '/gallery', label: 'Gallery' }, { to: '/login', label: 'Log in' }] },
  ],
}) {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div>
          <div className="footer__brand"><BrandLogo size={56} /><div><h4>{brand}</h4><small>Maharana Pratap Group of Institutions</small></div></div>
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
        <div className="container">© {new Date().getFullYear()} Maharana Pratap Group of Institutions. Demonstration build: sample data is fictional.</div>
      </div>
    </footer>
  );
}
