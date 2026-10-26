import { Link } from 'react-router-dom';
import '../styles/directory.css';

export default function EventCard({ event, to }) {
  const title = event.title || event.name;
  const image = event.image || event.banner;
  const loc = event.location || event.venue;
  const d = event.date ? new Date(event.date) : null;
  const valid = d && !Number.isNaN(d.getTime());
  const link = to || `/events/${event.id ?? event._id}`;

  return (
    <article className="card card--hover media-card">
      <div className="media-card__wrap">
        {image
          ? <img className="media-card__img" src={image} alt={`Banner for ${title}`} loading="lazy" />
          : <div className="media-card__img" role="img" aria-label="" />}
        {valid && (
          <div className="date-badge" aria-hidden="true">
            <strong>{d.getDate()}</strong>
            <span>{d.toLocaleString('en', { month: 'short' }).toUpperCase()}</span>
          </div>
        )}
      </div>
      <div className="media-card__body">
        <h3>{title}</h3>
        {(valid || loc) && (
          <div className="media-card__meta">
            {valid && <time dateTime={d.toISOString()}>{d.toLocaleDateString('en', { dateStyle: 'medium' })}</time>}
            {loc && <span>{loc}</span>}
          </div>
        )}
        {event.description && <p>{event.description}</p>}
        <Link to={link} className="btn btn--primary btn--sm">View details</Link>
      </div>
    </article>
  );
}
