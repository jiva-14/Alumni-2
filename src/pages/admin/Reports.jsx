import { Icon } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { alumni, events, opportunities, posts } from '../../data/mockData';
import { activityLogs, enquiries, students, users } from '../../data/adminData';

const SETS = [
  { key: 'alumni', label: 'Alumni directory', rows: alumni, desc: 'Names, batches, departments, employers.', skip: ['bio'] },
  { key: 'events', label: 'Events', rows: events, desc: 'Schedule, venue and capacity.', skip: ['description'] },
  { key: 'articles', label: 'Articles', rows: posts, desc: 'Published blog posts.', skip: ['content'] },
  { key: 'opportunities', label: 'Jobs & internships', rows: opportunities, desc: 'Shared opportunities.', skip: [] },
  { key: 'students', label: 'Students', rows: students, desc: 'Current student records.', skip: [] },
  { key: 'users', label: 'Users', rows: users, desc: 'Accounts and roles.', skip: [] },
  { key: 'enquiries', label: 'Contact enquiries', rows: enquiries, desc: 'Messages from the contact form.', skip: [] },
  { key: 'activity', label: 'Activity log', rows: activityLogs, desc: 'Administrative actions.', skip: [] },
];

const cell = (v) => {
  const t = Array.isArray(v) ? v.join('; ') : v ?? '';
  const s = String(t);
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};

function download(set) {
  const cols = Object.keys(set.rows[0] || {}).filter((k) => !set.skip.includes(k));
  const csv = [cols.join(','), ...set.rows.map((r) => cols.map((c) => cell(r[c])).join(','))].join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url; a.download = `${set.key}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove();
  URL.revokeObjectURL(url);
}

export default function Reports() {
  const toast = useToast();
  return (
    <>
      <div className="dash-head"><div><h1>Reports & exports</h1><p>Download portal data as CSV files that open in Excel or Google Sheets.</p></div></div>
      <div className="card panel">
        <ul className="row-list">
          {SETS.map((s) => (
            <li key={s.key}>
              <span className="row-list__icon"><Icon name="clipboard" size={18} /></span>
              <span className="row-list__main"><strong>{s.label}</strong><span>{s.desc} · {s.rows.length} records</span></span>
              <button className="btn btn--outline btn--sm" onClick={() => { download(s); toast.success(`${s.label} exported as CSV.`); }}><Icon name="download" size={16} /> CSV</button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
