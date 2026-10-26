import { useId, useMemo, useState } from 'react';
import SearchBar from './SearchBar';
import { ConfirmDialog, DataTable, Icon, Modal, Pagination } from './ui';
import { useToast } from '../context/ToastContext';

const PAGE_SIZE = 8;

/**
 * Reusable admin CRUD screen (in-memory). Wire onCreate/onUpdate/onDelete to your API later.
 * fields: [{ name, label, type: 'text'|'textarea'|'select'|'date'|'number', options?, required? }]
 * columns: DataTable columns.
 */
export default function ManageTable({ title, subtitle, noun, items, setItems, columns, fields, searchKeys, extraActions }) {
  const uid = useId();
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);   // item | {} for new
  const [form, setForm] = useState({});
  const [errors, setErrors] = useState({});
  const [toDelete, setToDelete] = useState(null);
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const toast = useToast();
  const statuses = useMemo(() => [...new Set(items.map((r) => r.status).filter(Boolean))], [items]);

  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    const byStatus = status === 'All' ? items : items.filter((r) => r.status === status);
    return t ? byStatus.filter((r) => searchKeys.some((k) => String(r[k] ?? '').toLowerCase().includes(t))) : byStatus;
  }, [items, q, status, searchKeys]);
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const current = Math.min(page, pages);
  const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);

  const open = (item) => { setEditing(item); setForm(item); setErrors({}); };
  const close = () => setEditing(null);

  const save = (e) => {
    e.preventDefault();
    const errs = {};
    fields.forEach((f) => { if (f.required && !String(form[f.name] ?? '').trim()) errs[f.name] = `${f.label} is required`; });
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error('Please fix the highlighted fields.'); return; }
    if (editing.id) {
      setItems((list) => list.map((r) => (r.id === editing.id ? { ...r, ...form } : r)));
      toast.success(`${noun} updated.`);
    } else {
      setItems((list) => [{ ...form, id: Date.now() }, ...list]);
      toast.success(`${noun} added.`);
    }
    close();
  };

  const confirmDelete = () => {
    setItems((list) => list.filter((r) => r.id !== toDelete.id));
    setToDelete(null);
    toast.success(`${noun} deleted.`);
  };

  return (
    <>
      <div className="dash-head">
        <div><h1>{title}</h1>{subtitle && <p>{subtitle}</p>}</div>
        <button className="btn btn--primary" onClick={() => open({})}><Icon name="plus" size={18} /> Add {noun.toLowerCase()}</button>
      </div>
      <div className="card panel">
        <div className="table-tools">
          <SearchBar value={q} onChange={(v) => { setQ(v); setPage(1); }} placeholder={`Search ${noun.toLowerCase()}s`} label={`Search ${noun.toLowerCase()}s`} />
          {statuses.length > 0 && (
            <select className="select" value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} aria-label="Filter by status">
              <option value="All">All statuses</option>
              {statuses.map((x) => <option key={x} value={x}>{x}</option>)}
            </select>
          )}
        </div>
        <DataTable columns={columns} rows={pageRows} emptyTitle={`No ${noun.toLowerCase()}s found`}
          emptyMessage={q || status !== 'All' ? 'Try a different search or filter.' : `Add your first ${noun.toLowerCase()} to get started.`}
          renderActions={(r) => (
            <>
              {extraActions?.(r)}
              <button className="btn btn--outline btn--sm" onClick={() => open(r)} aria-label={`Edit ${r.title || r.name}`} data-tip="Edit"><Icon name="edit" size={15} /> Edit</button>
              <button className="btn btn--outline btn--sm btn--danger-ghost" onClick={() => setToDelete(r)} aria-label={`Delete ${r.title || r.name}`} data-tip="Delete"><Icon name="trash" size={15} /> Delete</button>
            </>
          )} />
        <Pagination page={current} pages={pages} total={rows.length} pageSize={PAGE_SIZE} onPage={setPage} />
      </div>

      <Modal open={!!editing} onClose={close} title={editing?.id ? `Edit ${noun.toLowerCase()}` : `Add ${noun.toLowerCase()}`}>
        <form onSubmit={save} noValidate>
          {fields.map((f) => {
            const id = `${uid}-${f.name}`;
            const common = { id, name: f.name, value: form[f.name] ?? '', 'aria-invalid': !!errors[f.name],
              'aria-describedby': errors[f.name] ? `${id}-err` : undefined,
              onChange: (e) => setForm((s) => ({ ...s, [f.name]: e.target.value })) };
            return (
              <div className="field" key={f.name}>
                <label htmlFor={id}>{f.label}{f.required && ' *'}</label>
                {f.type === 'textarea' ? <textarea className="textarea" {...common} />
                  : f.type === 'select' ? (
                    <select className="select" {...common}>
                      <option value="">Select…</option>
                      {f.options.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : <input className="input" type={f.type || 'text'} {...common} />}
                {errors[f.name] && <span id={`${id}-err`} className="field__error">{errors[f.name]}</span>}
              </div>
            );
          })}
          <div className="modal__foot">
            <button type="button" className="btn btn--outline" onClick={close}>Cancel</button>
            <button type="submit" className="btn btn--primary">Save changes</button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog open={!!toDelete} onCancel={() => setToDelete(null)} onConfirm={confirmDelete}
        title={`Delete ${noun.toLowerCase()}?`} message={`“${toDelete?.title || toDelete?.name}” will be removed. This cannot be undone.`} />
    </>
  );
}
