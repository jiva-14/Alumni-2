import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import EventCard from '../components/EventCard';
import { EmptyState } from '../components/ui';
import { events } from '../data/mockData';

const CATS = ['All', ...new Set(events.map((e) => e.category))];

export default function Events() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return events
      .filter((e) => cat === 'All' || e.category === cat)
      .filter((e) => !t || `${e.title} ${e.location} ${e.description}`.toLowerCase().includes(t))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [q, cat]);

  return (
    <>
      <PageHeader title="Events" subtitle="Reunions, talks and meet-ups for alumni." crumbs={[{ to: '/', label: 'Home' }, { label: 'Events' }]} />
      <div className="section"><div className="container">
        <div className="toolbar"><SearchBar value={q} onChange={setQ} placeholder="Search events" label="Search events" /></div>
        <div className="tabs" role="group" aria-label="Filter by category">
          {CATS.map((c) => <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {list.length === 0
          ? <EmptyState icon="calendar" title="No events found" message="Try another category or search term." />
          : <div className="grid-3">{list.map((e) => <EventCard key={e.id} event={e} />)}</div>}
      </div></div>
    </>
  );
}
