import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import SearchBar from '../../components/SearchBar';
import { EmptyState, Icon } from '../../components/ui';
import { events } from '../../data/mockData';

const CATS = ['All', ...new Set(events.map((e) => e.category))];
const fmt = (d) => new Date(d).toLocaleDateString('en', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });

/** Member-area view of the events list. Each card links to the existing public event page, where registration lives. */
export default function MemberEvents() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return events.filter((e) => (cat === 'All' || e.category === cat) && (!t || `${e.title} ${e.location} ${e.description}`.toLowerCase().includes(t)))
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [q, cat]);

  return (
    <>
      <div className="dash-head"><div><h1>Events</h1><p>Reunions, talks and meet-ups for MPGI alumni. Open an event to read the details and register.</p></div></div>
      <div className="toolbar"><SearchBar value={q} onChange={setQ} placeholder="Search by event, place or topic" label="Search events" /></div>
      <div className="tabs" role="group" aria-label="Filter by category">
        {CATS.map((c) => <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      {list.length === 0 ? <EmptyState icon="calendar" title="No events found" message="Try a different search or category." /> : (
        <div className="grid-2">
          {list.map((e) => (
            <article key={e.id} className="card card--pad event-row">
              <div className="chips" style={{ marginBottom: '.5rem' }}><span className="badge">{e.category}</span><span className="badge badge--info">{e.location}</span></div>
              <h3>{e.title}</h3>
              <p className="event-row__when"><Icon name="calendar" size={15} /> {fmt(e.date)} · {e.time}</p>
              <p style={{ color: 'var(--muted)' }}>{e.description}</p>
              <Link to={`/events/${e.id}`} className="btn btn--primary btn--sm">View details &amp; register</Link>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
