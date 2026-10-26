import { useState } from 'react';
import { EmptyState } from '../../components/ui';
import { enquiries as seed } from '../../data/adminData';

const BADGE = { New: 'warning', 'In progress': 'info', Resolved: 'success' };

export default function Enquiries() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState('All');
  const rows = items.filter((e) => filter === 'All' || e.status === filter);
  const set = (id, status) => setItems((l) => l.map((e) => (e.id === id ? { ...e, status } : e)));

  return (
    <>
      <div className="dash-head"><div><h1>Contact enquiries</h1><p>Messages sent through the public contact form.</p></div></div>
      <div className="tabs" role="group" aria-label="Filter by status">
        {['All', 'New', 'In progress', 'Resolved'].map((f) => <button key={f} className="tab" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <div className="card panel">
        {rows.length ? rows.map((e) => (
          <article className="enq" key={e.id}>
            <div className="enq__top">
              <div><strong>{e.subject}</strong><div style={{ color: 'var(--muted)', fontSize: '.84rem' }}>{e.name} · {e.email} · {new Date(e.date).toLocaleDateString('en', { dateStyle: 'medium' })}</div></div>
              <span className={`badge badge--${BADGE[e.status]}`}>{e.status}</span>
            </div>
            <p className="enq__msg">{e.message}</p>
            <div className="enq__actions">
              <a className="btn btn--primary btn--sm" href={`mailto:${e.email}?subject=${encodeURIComponent(`Re: ${e.subject}`)}`}>Reply by email</a>
              {e.status === 'New' && <button className="btn btn--outline btn--sm" onClick={() => set(e.id, 'In progress')}>Start working</button>}
              {e.status !== 'Resolved' && <button className="btn btn--outline btn--sm" onClick={() => set(e.id, 'Resolved')}>Mark resolved</button>}
              {e.status === 'Resolved' && <button className="btn btn--outline btn--sm" onClick={() => set(e.id, 'New')}>Reopen</button>}
            </div>
          </article>
        )) : <EmptyState icon="mail" title="No enquiries" message="Nothing matches this filter." />}
      </div>
    </>
  );
}
