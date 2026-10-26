import { Link } from 'react-router-dom';
import '../styles/directory.css';

/** crumbs: [{ to?, label }] — the last item is the current page. */
export default function PageHeader({ title, subtitle, crumbs = [], children }) {
  return (
    <section className="page-header">
      <div className="container">
        {crumbs.length > 0 && (
          <nav className="crumbs" aria-label="Breadcrumb">
            {crumbs.map((c, i) => (
              <span key={c.label}>
                {c.to ? <Link to={c.to}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
                {i < crumbs.length - 1 && ' / '}
              </span>
            ))}
          </nav>
        )}
        <div className="page-header__row">
          <div>
            <h1>{title}</h1>
            {subtitle && <p>{subtitle}</p>}
          </div>
          {children}
        </div>
      </div>
    </section>
  );
}
