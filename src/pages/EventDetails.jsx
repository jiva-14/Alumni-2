import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { EmptyState, Icon } from '../components/ui';
import { events } from '../data/mockData';

export default function EventDetails() {
  const { id } = useParams();
  const event = events.find((e) => String(e.id) === id);
  const [registered, setRegistered] = useState(false); // UI-only; connect to your API

  if (!event) {
    return <div className="section"><div className="container">
      <EmptyState icon="calendar" title="Event not found" message="It may have been removed or the link is incorrect."
        action={<Link to="/events" className="btn btn--primary">See all events</Link>} /></div></div>;
  }
  const d = new Date(event.date);

  return (
    <>
      <PageHeader title={event.title} subtitle={event.description}
        crumbs={[{ to: '/', label: 'Home' }, { to: '/events', label: 'Events' }, { label: event.title }]} />
      <div className="section"><div className="container detail">
        <article className="card detail__main prose">
          <span className="badge">{event.category}</span>
          <h2 style={{ marginTop: '1rem' }}>About this event</h2>
          {event.details.map((p) => <p key={p}>{p}</p>)}
        </article>
        <aside className="card detail__side" aria-label="Event information">
          <ul className="detail__list">
            <li><Icon name="calendar" /><span><strong>Date</strong>{d.toLocaleDateString('en', { dateStyle: 'full' })}</span></li>
            <li><Icon name="home" /><span><strong>Time</strong>{event.time}</span></li>
            <li><Icon name="home" /><span><strong>Location</strong>{event.location}</span></li>
            <li><Icon name="users" /><span><strong>Capacity</strong>{event.capacity} attendees</span></li>
          </ul>
          {registered
            ? <div className="alert alert--success" role="status">You are registered for this event.</div>
            : <button className="btn btn--primary" style={{ width: '100%' }} onClick={() => setRegistered(true)}>Register now</button>}
          {registered && <button className="btn btn--ghost btn--sm" style={{ marginTop: '.5rem' }} onClick={() => setRegistered(false)}>Cancel registration</button>}
        </aside>
      </div></div>
    </>
  );
}
