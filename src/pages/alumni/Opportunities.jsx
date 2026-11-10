import { useMemo, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { EmptyState } from '../../components/ui';
import { PersonCell } from '../../components/Avatar';
import { alumni, opportunities } from '../../data/mockData';
import { photoFor } from '../../utils/profile';

const byName = Object.fromEntries(alumni.map((a) => [a.name, a]));

const TYPES = ['All', ...new Set(opportunities.map((o) => o.type))];

export default function Opportunities() {
  const [q, setQ] = useState('');
  const [type, setType] = useState('All');
  const [applied, setApplied] = useState([]); // UI-only state
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return opportunities.filter((o) => (type === 'All' || o.type === type) && (!t || `${o.title} ${o.company} ${o.location}`.toLowerCase().includes(t)));
  }, [q, type]);

  return (
    <>
      <div className="dash-head"><div><h1>Opportunities</h1><p>Jobs and internships shared by fellow alumni.</p></div></div>
      <div className="toolbar"><SearchBar value={q} onChange={setQ} placeholder="Search by title, company or city" label="Search opportunities" /></div>
      <div className="tabs" role="group" aria-label="Filter by type">
        {TYPES.map((t) => <button key={t} className="tab" aria-pressed={type === t} onClick={() => setType(t)}>{t}</button>)}
      </div>
      {list.length === 0 ? <EmptyState icon="briefcase" title="No opportunities found" message="Try a different search or type." /> : (
        <div className="grid-2">
          {list.map((o) => (
            <article key={o.id} className="card card--hover card--pad">
              <div className="chips" style={{ marginBottom: '.5rem' }}><span className="badge">{o.type}</span><span className="badge badge--info">{o.location}</span></div>
              <h3>{o.title}</h3>
              <p style={{ margin: '0 0 .5rem', color: 'var(--navy-800)', fontWeight: 600 }}>{o.company}</p>
              <p style={{ color: 'var(--muted)' }}>{o.description}</p>
              <p className="shared-by"><span>Shared by</span><PersonCell name={o.postedBy} src={photoFor(byName[o.postedBy])} size="xs" /></p>
              <button className={`btn btn--sm ${applied.includes(o.id) ? 'btn--outline' : 'btn--primary'}`} disabled={applied.includes(o.id)}
                onClick={() => setApplied((a) => [...a, o.id])}>{applied.includes(o.id) ? 'Interest sent' : 'I’m interested'}</button>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
