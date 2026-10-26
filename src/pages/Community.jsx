import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Icon } from '../components/ui';
import { groups } from '../data/mockData';

export default function Community() {
  const [joined, setJoined] = useState([]); // UI-only state
  const toggle = (id) => setJoined((j) => (j.includes(id) ? j.filter((x) => x !== id) : [...j, id]));
  return (
    <>
      <PageHeader title="Community" subtitle="Join groups to meet alumni with shared interests." crumbs={[{ to: '/', label: 'Home' }, { label: 'Community' }]} />
      <div className="section"><div className="container">
        <div className="grid-2">
          {groups.map((g) => (
            <article key={g.id} className="card card--hover card--pad">
              <div className="stat-card__icon" style={{ marginBottom: '1rem' }}><Icon name="users" /></div>
              <h3>{g.name}</h3>
              <p style={{ color: 'var(--muted)' }}>{g.description}</p>
              <button className={`btn ${joined.includes(g.id) ? 'btn--outline' : 'btn--primary'} btn--sm`} onClick={() => toggle(g.id)} aria-pressed={joined.includes(g.id)}>
                {joined.includes(g.id) ? 'Leave group' : 'Join group'}
              </button>
            </article>
          ))}
        </div>
      </div></div>
    </>
  );
}
