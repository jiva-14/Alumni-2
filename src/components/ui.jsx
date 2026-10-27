import { useEffect, useId, useRef } from 'react';
import { Link } from 'react-router-dom';

const PATHS = {
  menu: 'M3 6h18M3 12h18M3 18h18',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 4a7 7 0 105 12l4 4 M11 4a7 7 0 010 14',
  calendar: 'M4 7h16v13H4zM4 11h16M8 3v4M16 3v4',
  users: 'M16 20v-2a4 4 0 00-4-4H7a4 4 0 00-4 4v2M9.5 10a3.5 3.5 0 100-7 3.5 3.5 0 000 7M21 20v-2a4 4 0 00-3-3.9M16 3.1a3.5 3.5 0 010 6.8',
  book: 'M4 5a2 2 0 012-2h13v16H6a2 2 0 00-2 2zM4 19a2 2 0 012-2h13',
  briefcase: 'M3 8h18v12H3zM9 8V5h6v3M3 13h18',
  image: 'M3 5h18v14H3zM3 16l5-5 4 4 3-3 6 6M9 9.5a.5.5 0 100-1',
  home: 'M3 11l9-8 9 8M5 10v10h14V10',
  check: 'M5 12l5 5 9-10',
  arrow: 'M5 12h14M13 6l6 6-6 6',
  logout: 'M9 4H4v16h5M16 8l4 4-4 4M20 12H9',
  user: 'M12 12a4 4 0 100-8 4 4 0 000 8M4 21a8 8 0 0116 0',
  inbox: 'M3 13l3-8h12l3 8v6H3zM3 13h5l1 3h6l1-3h5',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  bell: 'M6 9a6 6 0 0112 0c0 6 2 7 2 7H4s2-1 2-7M10 20a2 2 0 004 0',
  student: 'M2 9l10-5 10 5-10 5zM6 11.5V16c0 1.5 3 3 6 3s6-1.5 6-3v-4.5',
  faculty: 'M3 4h18v12H3zM8 20h8M12 16v4M7 9h6M7 12h10',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  megaphone: 'M3 11v3a1 1 0 001 1h2l7 4V6L6 10H4a1 1 0 00-1 1zM17 9a4 4 0 010 6',
  news: 'M5 4h12a2 2 0 012 2v14H7a2 2 0 01-2-2zM19 8h2v10a2 2 0 01-2 2M9 8h6M9 12h6M9 16h4',
  star: 'M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z',
  mail: 'M3 6h18v12H3zM3 7l9 7 9-7',
  download: 'M12 4v11M7 11l5 5 5-5M4 20h16',
  activity: 'M3 12h4l3-8 4 16 3-8h4',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6M19.4 15a1.7 1.7 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.7 1.7 0 00-1.8-.3 1.7 1.7 0 00-1 1.5V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1-1.5 1.7 1.7 0 00-1.8.3l-.1.1a2 2 0 11-2.8-2.8l.1-.1a1.7 1.7 0 00.3-1.8 1.7 1.7 0 00-1.5-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.5-1 1.7 1.7 0 00-.3-1.8l-.1-.1a2 2 0 112.8-2.8l.1.1a1.7 1.7 0 001.8.3h0a1.7 1.7 0 001-1.5V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.5 1.7 1.7 0 001.8-.3l.1-.1a2 2 0 112.8 2.8l-.1.1a1.7 1.7 0 00-.3 1.8v0a1.7 1.7 0 001.5 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.5 1z',
  lock: 'M5 11h14v9H5zM8 11V8a4 4 0 018 0v3',
  help: 'M12 21a9 9 0 100-18 9 9 0 000 18M9.5 9.5a2.5 2.5 0 114 2c-1 .7-1.5 1.2-1.5 2.5M12 17.5v.01',
  chevronL: 'M15 6l-6 6 6 6',
  chevronR: 'M9 6l6 6-6 6',
  chevronD: 'M6 9l6 6 6-6',
  panel: 'M3 4h18v16H3zM9 4v16',
  trendUp: 'M3 17l6-6 4 4 8-8M15 7h6v6',
  plus: 'M12 5v14M5 12h14',
  clipboard: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12M12 15a3 3 0 100-6 3 3 0 000 6',
  externalLink: 'M14 4h6v6M20 4l-9 9M18 14v6H4V6h6',
  moon: 'M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z',
  sun: 'M12 16a4 4 0 100-8 4 4 0 000 8M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  eyeOff: 'M3 3l18 18M10.6 5.1A9.8 9.8 0 0112 5c6 0 10 7 10 7a17 17 0 01-3.2 3.9M6.6 6.6A17 17 0 002 12s4 7 10 7a9.6 9.6 0 004.4-1M9.9 9.9a3 3 0 004.2 4.2',
  edit: 'M4 20h4L19 9l-4-4L4 16zM14 6l4 4',
  sparkle: 'M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8zM19 17l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z',
};

export function Icon({ name, size = 20, ...rest }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...rest}>
      <path d={PATHS[name] || PATHS.inbox} />
    </svg>
  );
}

export function EmptyState({ title = 'Nothing here yet', message, icon = 'inbox', action }) {
  return (
    <div className="empty" role="status">
      <div className="empty__icon"><Icon name={icon} size={26} /></div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {action}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong while loading this page.', onRetry }) {
  return (
    <div className="alert alert--error" role="alert">
      {message}{' '}
      {onRetry && <button className="btn btn--outline btn--sm" onClick={onRetry}>Try again</button>}
    </div>
  );
}

/** Placeholder cards while data loads. */
export function CardSkeletons({ count = 6, height = 190 }) {
  return (
    <div className="card-grid" aria-busy="true" aria-label="Loading">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="skeleton" style={{ height }} />
      ))}
    </div>
  );
}

const STATUS = {
  approved: 'success', published: 'success', active: 'success',
  pending: 'warning', draft: 'warning',
  rejected: 'danger', inactive: 'danger',
};
export function StatusBadge({ status }) {
  if (!status) return null;
  const key = String(status).toLowerCase();
  return <span className={`badge badge--${STATUS[key] || 'info'}`}>{status}</span>;
}

export function StatCard({ icon = 'users', label, value, trend, hint, to, tone = 'indigo' }) {
  const body = (
    <>
      <div className="stat-card__icon"><Icon name={icon} /></div>
      <div className="stat-card__body">
        <div className="stat-card__label">{label}</div>
        <div className="stat-card__value">{value}</div>
        {(trend || hint) && (
          <div className="stat-card__meta">
            {trend && <span className="stat-card__trend"><Icon name="trendUp" size={14} />{trend}</span>}
            {hint && <span>{hint}</span>}
          </div>
        )}
      </div>
    </>
  );
  const cls = `card stat-card stat-card--${tone}`;
  return to
    ? <Link to={to} className={`${cls} stat-card--link`}>{body}</Link>
    : <div className={cls}>{body}</div>;
}

/** Notice for screens whose backend does not exist yet. */
export function PreviewNote({ children = 'Preview only: this screen works with sample data. Saving to a server needs a backend to be connected.' }) {
  return (
    <div className="preview-note" role="note">
      <Icon name="sparkle" size={16} /><span>{children}</span>
    </div>
  );
}

/**
 * Accessible modal: traps Tab focus, closes on Escape / backdrop click, locks page scroll,
 * and returns focus to the element that opened it.
 */
const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
export function Modal({ open, title, onClose, children, footer }) {
  const ref = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();
  useEffect(() => {
    if (!open) return undefined;
    const opener = document.activeElement;
    const node = ref.current;
    const first = node?.querySelector('input,select,textarea') || node?.querySelector(FOCUSABLE) || node;
    first?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') { e.stopPropagation(); closeRef.current?.(); return; }
      if (e.key !== 'Tab' || !node) return;
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null);
      if (!items.length) { e.preventDefault(); return; }
      const a = items[0], z = items[items.length - 1];
      if (e.shiftKey && (document.activeElement === a || document.activeElement === node)) { e.preventDefault(); z.focus(); }
      else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
    };
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      if (opener && document.contains(opener)) opener.focus?.();
    };
  }, [open]);
  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby={titleId} tabIndex={-1} ref={ref}>
        <div className="modal__head">
          <h2 id={titleId}>{title}</h2>
          <button type="button" className="btn btn--ghost btn--sm" onClick={onClose} aria-label="Close dialog"><Icon name="close" /></button>
        </div>
        {children}
        {footer && <div className="modal__foot">{footer}</div>}
      </div>
    </div>
  );
}

/**
 * columns: [{ key, header, render?(row), sortable? }]   rows: array of objects
 * renderActions?(row) -> node, shown in the last column.
 * Pass `sort` ({ key, dir }) and `onSort(key)` to make headers sortable (aria-sort is set for assistive tech).
 */
export function DataTable({ columns, rows = [], renderActions, rowKey = 'id', emptyTitle = 'No records found', emptyMessage, sort, onSort, caption }) {
  if (!rows.length) return <EmptyState title={emptyTitle} message={emptyMessage} />;
  return (
    <div className="table-wrap" tabIndex={0} role="region" aria-label={caption || 'Data table'}>
      <table className="table">
        <thead>
          <tr>
            {columns.map((c) => {
              const canSort = onSort && c.sortable !== false;
              const active = sort?.key === c.key;
              return (
                <th key={c.key} scope="col" aria-sort={active ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                  {canSort ? (
                    <button type="button" className={`th-sort${active ? ' on' : ''}`} onClick={() => onSort(c.key)}>
                      {c.header}
                      <span className="th-sort__mark" aria-hidden="true">{active ? (sort.dir === 'asc' ? '▲' : '▼') : '↕'}</span>
                    </button>
                  ) : c.header}
                </th>
              );
            })}
            {renderActions && <th scope="col"><span className="sr-only">Actions</span></th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row[rowKey] ?? i}>
              {columns.map((c) => <td key={c.key}>{c.render ? c.render(row) : row[c.key]}</td>)}
              {renderActions && <td><div className="table__actions">{renderActions(row)}</div></td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Accessible on/off switch. */
export function Toggle({ checked, onChange, label, id }) {
  return (
    <button type="button" role="switch" id={id} aria-checked={checked} aria-label={label}
      className={`switch${checked ? ' on' : ''}`} onClick={() => onChange(!checked)}>
      <span className="switch__thumb" />
    </button>
  );
}

/** Consistent confirmation dialog (destructive by default). */
export function ConfirmDialog({ open, title, message, confirmLabel = 'Delete', tone = 'danger', onConfirm, onCancel }) {
  return (
    <Modal open={open} onClose={onCancel} title={title}
      footer={<><button className="btn btn--outline" onClick={onCancel}>Cancel</button><button className={`btn btn--${tone}`} onClick={onConfirm}>{confirmLabel}</button></>}>
      <p style={{ color: 'var(--muted)' }}>{message}</p>
    </Modal>
  );
}

/** Pagination controls for client-side lists. */
export function Pagination({ page, pages, total, pageSize, onPage }) {
  if (pages <= 1) return null;
  const from = (page - 1) * pageSize + 1, to = Math.min(page * pageSize, total);
  return (
    <nav className="pager" aria-label="Pagination">
      <span className="pager__info">{from}–{to} of {total}</span>
      <div className="pager__btns">
        <button className="btn btn--outline btn--sm" onClick={() => onPage(page - 1)} disabled={page <= 1} aria-label="Previous page"><Icon name="chevronL" size={16} /></button>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <button key={n} className={`pager__n${n === page ? ' on' : ''}`} onClick={() => onPage(n)} aria-current={n === page ? 'page' : undefined}>{n}</button>
        ))}
        <button className="btn btn--outline btn--sm" onClick={() => onPage(page + 1)} disabled={page >= pages} aria-label="Next page"><Icon name="chevronR" size={16} /></button>
      </div>
    </nav>
  );
}

/** Skeleton for a table or chart panel while data loads. */
export function PanelSkeleton({ rows = 4, height = 18 }) {
  return (
    <div aria-busy="true" aria-label="Loading" style={{ display: 'grid', gap: 12 }}>
      {Array.from({ length: rows }, (_, i) => <div key={i} className="skeleton" style={{ height, width: `${100 - i * 8}%` }} />)}
    </div>
  );
}
