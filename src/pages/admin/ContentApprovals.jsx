import { useState } from 'react';
import { DataTable, StatusBadge } from '../../components/ui';
import { approvals } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';

export default function ContentApprovals() {
  const [items, setItems] = useState(approvals);
  const [filter, setFilter] = useState('Pending');
  const toast = useToast();
  const set = (id, status) => { setItems((l) => l.map((x) => (x.id === id ? { ...x, status } : x))); toast[status === 'Approved' ? 'success' : 'info'](`Submission ${status.toLowerCase()}.`); };
  const rows = items.filter((i) => filter === 'All' || i.status === filter);

  return (
    <>
      <div className="dash-head"><div><h1>Content approvals</h1><p>Review submissions before they appear on the site.</p></div></div>
      <div className="tabs" role="group" aria-label="Filter by status">
        {['Pending', 'Approved', 'Rejected', 'All'].map((f) => <button key={f} className="tab" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <div className="card panel">
        <DataTable rows={rows} emptyTitle="Nothing to review" emptyMessage="No submissions match this filter."
          columns={[
            { key: 'type', header: 'Type' }, { key: 'title', header: 'Title' }, { key: 'submittedBy', header: 'Submitted by' },
            { key: 'date', header: 'Date', render: (r) => new Date(r.date).toLocaleDateString('en', { dateStyle: 'medium' }) },
            { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]}
          renderActions={(r) => r.status === 'Pending' && (
            <>
              <button className="btn btn--primary btn--sm" onClick={() => set(r.id, 'Approved')} aria-label={`Approve ${r.title}`}>Approve</button>
              <button className="btn btn--outline btn--sm" onClick={() => set(r.id, 'Rejected')} aria-label={`Reject ${r.title}`}>Reject</button>
            </>
          )} />
      </div>
    </>
  );
}
