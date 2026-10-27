import { useEffect, useId, useMemo, useRef, useState } from 'react';
import SearchBar from './SearchBar';
import { ConfirmDialog, DataTable, Icon, Modal, Pagination } from './ui';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 8;
const EMAIL = /^\S+@\S+\.\S+$/;
const slug = (s) => String(s).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const newId = () => (globalThis.crypto?.randomUUID ? globalThis.crypto.randomUUID() : `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`);

/** Compare two cell values: numbers numerically, everything else as case-insensitive text. */
function compare(a, b) {
  const x = a ?? '', y = b ?? '';
  const nx = Number(x), ny = Number(y);
  if (x !== '' && y !== '' && Number.isFinite(nx) && Number.isFinite(ny)) return nx - ny;
  return String(x).localeCompare(String(y), undefined, { sensitivity: 'base', numeric: true });
}

/** Validates one field value against its definition. Returns an error message or ''. */
export function validateField(f, raw) {
  const v = String(raw ?? '').trim();
  if (!v) return f.required ? `${f.label} is required` : '';
  if (f.type === 'email' && !EMAIL.test(v)) return 'Enter a valid email address';
  if (f.type === 'number') {
    const n = Number(v);
    if (!Number.isFinite(n)) return `${f.label} must be a number`;
    if (f.min != null && n < f.min) return `${f.label} must be ${f.min} or more`;
    if (f.max != null && n > f.max) return `${f.label} must be ${f.max} or less`;
  }
  if (f.type === 'date' && Number.isNaN(Date.parse(v))) return 'Enter a valid date';
  if (f.type === 'url' && !/^https?:\/\/\S+\.\S+/.test(v)) return 'Enter a full link starting with http:// or https://';
  const max = f.maxLength ?? (f.type === 'textarea' ? 1000 : 200);
  if (v.length > max) return `${f.label} must be ${max} characters or fewer`;
  return '';
}

/**
 * Reusable admin CRUD screen. FRONTEND DEMO ONLY: changes are kept in this browser's localStorage
 * (key `portal-demo:<title>`) so they survive a refresh. They are not shared, not secure and not a database.
 *
 * fields:  [{ name, label, type: 'text'|'textarea'|'select'|'date'|'number'|'email'|'url', options?, required?, maxLength?, min?, max? }]
 * columns: DataTable columns.   `storageKey` overrides the default persistence key.
 */
export default function ManageTable({ title, subtitle, noun, items, setItems, columns, fields, searchKeys, extraActions, storageKey }) {
  const uid = useId();
  const key = `portal-demo:${storageKey || slug(title)}`;
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);   // item | {} for new
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [discard, setDiscard] = useState(false);
  const [status, setStatus] = useState('All');
  const [sort, setSort] = useState(null);         // { key, dir }
  const [page, setPage] = useState(1);
  const [loaded, setLoaded] = useState(false);
  const [modified, setModified] = useState(false);
  const toast = useToast();
  const seed = useRef(items);                     // pristine sample data, for "Reset to sample data"
  const lower = noun.toLowerCase();

  // Restore saved demo data once, then persist every later change.
  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) { setItems(parsed); setModified(true); }
      }
    } catch { /* storage unavailable or corrupted: keep sample data */ }
    setLoaded(true);
  }, [key, setItems]);
  useEffect(() => {
    if (!loaded || !modified) return;
    try { localStorage.setItem(key, JSON.stringify(items)); }
    catch { toast.error('Could not save to browser storage. Changes will be lost on refresh.'); }
  }, [items, loaded, modified, key]); // eslint-disable-line react-hooks/exhaustive-deps

  const change = (updater) => { setModified(true); setItems(updater); };

  const statuses = useMemo(() => [...new Set(items.map((r) => r.status).filter(Boolean))], [items]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const byStatus = status === 'All' ? items : items.filter((r) => r.status === status);
    const found = t ? byStatus.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(t))) : byStatus;
    if (!sort) return found;
    const dir = sort.dir === 'asc' ? 1 : -1;
    return [...found].sort((a, b) => dir * compare(a[sort.key], b[sort.key]));
  }, [items, q, status, searchKeys, sort]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
  const filtered = !!q || status !== 'All';

  const onSort = (k) => {
    setPage(1);
    setSort((s) => (s?.key !== k ? { key: k, dir: 'asc' } : s.dir === 'asc' ? { key: k, dir: 'desc' } : null));
  };

  const snapshot = (obj) => JSON.stringify(fields.map((f) => String(obj?.[f.name] ?? '')));
  const dirty = !!editing && snapshot(form) !== snapshot(editing);

  const open = (item) => { setEditing(item); setForm({ ...item }); setErrors({}); };
  const close = () => { setEditing(null); setDiscard(false); };
  const requestClose = () => (dirty ? setDiscard(true) : close());

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => { const m = validateField(f, form[f.name]); if (m) errs[f.name] = m; });
    setErrors(errs);
    if (Object.keys(errs).length) {
      toast.error('Please fix the highlighted fields.');
      document.getElementById(`${uid}-${Object.keys(errs)[0]}`)?.focus();
      return;
    }
    const clean = Object.fromEntries(fields.map((f) => [f.name, typeof form[f.name] === 'string' ? form[f.name].trim() : form[f.name]]));
    if (editing.id != null) {
      const id = editing.id;
      change((list) => list.map((r) => (r.id === id ? { ...r, ...clean } : r)));
      toast.success(`${noun} updated (saved in this browser only).`);
    } else {
      change((list) => [{ ...clean, id: newId() }, ...list]);
      toast.success(`${noun} added (saved in this browser only).`);
    }
    close();
  };

  const confirmDelete = () => {
    const id = toDelete.id;
    change((list) => list.filter((r) => r.id !== id));
    setToDelete(null);
    toast.success(`${noun} deleted.`);
  };

  const resetDemo = () => {
    try { localStorage.removeItem(key); } catch { /* ignore */ }
    setItems(seed.current);
    setModified(false);
    setQ(''); setStatus('All'); setSort(null); setPage(1);
    toast.success('Sample data restored.');
  };

  const label = (r) => r.title || r.name || String(r.id);

  return (
    <>
      <div className="dash-head">
        <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
        <button type="button" className="btn btn--primary" onClick={() => open({})}><Icon name="plus" size={18} /> Add {lower}</button>
      </div>
      <div className="card panel">
        <div className="table-tools">
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder={`Search ${lower} records`} label={`Search ${lower} records`} />
          {statuses.length > 0 && (
            <select className="select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
              <option value="All">All statuses</option>
              {statuses.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          )}
          {filtered && <button type="button" className="btn btn--ghost btn--sm" onClick={() => { setQ(''); setStatus('All'); setPage(1); }}>Clear filters</button>}
        </div>
        <p className="result-count" aria-live="polite">
          {rows.length} {rows.length === 1 ? 'record' : 'records'}{filtered ? ' match' : ''}
          {sort && ` · sorted by ${columns.find((c) => c.key === sort.key)?.header || sort.key} (${sort.dir === 'asc' ? 'A–Z' : 'Z–A'})`}
        </p>
        <DataTable columns={columns} rows={pageRows} sort={sort} onSort={onSort} caption={`${title} table`}
          emptyTitle={`No ${lower} records found`}
          emptyMessage={filtered ? 'Try a different search or clear the filters.' : `Add your first ${lower} to get started.`}
          renderActions={(r) => (
            <>
              {extraActions?.(r)}
              <button type="button" className="btn btn--outline btn--sm" onClick={() => open(r)} aria-label={`Edit ${label(r)}`}><Icon name="edit" size={15} /> Edit</button>
              <button type="button" className="btn btn--outline btn--sm btn--danger-ghost" onClick={() => setToDelete(r)} aria-label={`Delete ${label(r)}`}><Icon name="trash" size={15} /> Delete</button>
            </>
          )} />
        <Pagination page={current} pages={pages} total={rows.length} pageSize={PAGE_SIZE} onPage={setPage} />
        <p className="demo-note">
          <Icon name="sparkle" size={14} /> Demo data: changes are stored in this browser only, are not shared with anyone and are not a secure record.
          {modified && <button type="button" className="link-btn" onClick={resetDemo}>Reset to sample data</button>}
        </p>
      </div>

      <Modal open={!!editing} onClose={requestClose} title={editing?.id != null ? `Edit ${lower}` : `Add ${lower}`}>
        <form onSubmit={save} noValidate>
          {fields.map((f) => {
            const id = `${uid}-${f.name}`;
            const max = f.maxLength ?? (f.type === 'textarea' ? 1000 : 200);
            const common = { id, name: f.name, value: form[f.name] ?? '', required: !!f.required,
              'aria-invalid': !!errors[f.name], 'aria-describedby': errors[f.name] ? `${id}-err` : undefined,
              onChange: (e) => { setForm((s) => ({ ...s, [f.name]: e.target.value })); if (errors[f.name]) setErrors((s) => ({ ...s, [f.name]: '' })); } };
            return (
              <div className="field" key={f.name}>
                <label htmlFor={id}>{f.label}{f.required && <span aria-hidden="true"> *</span>}</label>
                {f.type === 'textarea' ? <textarea className="textarea" maxLength={max} {...common} />
                  : f.type === 'select' ? (
                    <select className="select" {...common}>
                      <option value="">Select…</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : <input className="input" type={f.type || 'text'} maxLength={f.type === 'number' || f.type === 'date' ? undefined : max} min={f.min} max={f.max} {...common} />}
                {errors[f.name] && <span id={`${id}-err`} className="field__error" role="alert">{errors[f.name]}</span>}
              </div>
            );
          })}
          <div className="modal__foot">
            <button type="button" className="btn btn--outline" onClick={requestClose}>Cancel</button>
            <button type="submit" className="btn btn--primary">{editing?.id != null ? 'Save changes' : `Add ${lower}`}</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={discard} onCancel={() => setDiscard(false)} onConfirm={close} confirmLabel="Discard changes"
        title="Discard unsaved changes?" message="You have edits that have not been saved. If you close now they will be lost." />
      <ConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete}
        title={`Delete ${lower}?`} message={`“${toDelete ? label(toDelete) : ''}” will be removed from this browser's demo data. You can restore the sample data afterwards.`} />
    </>
  );
}
