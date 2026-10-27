import { Link } from 'react-router-dom';
import { StatCard, StatusBadge } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { activities, alumni, events, myArticles, opportunities } from '../../data/mockData';
import { completion, loadProfile } from '../../utils/profile';


export default function AlumniDashboard() {
  const { user } = useAuth();
  const c = completion(loadProfile(alumni[0]));
  const missing = c.items.filter((i) => !i.done);
  return (
    <>
      <div className="dash-head">
        <div><h1>Welcome, {user?.name}</h1><p>Demo dashboard: sample activity from the MPGI alumni network.</p></div>
        <Link to="/member/articles" className="btn btn--primary">Write an article</Link>
      </div>

      <div className="stat-grid">
        <StatCard tone="indigo" icon="book" label="My articles" value={myArticles.length} />
        <StatCard tone="teal" icon="calendar" label="Upcoming events" value={events.length} />
        <StatCard tone="amber" icon="briefcase" label="Open opportunities" value={opportunities.length} />
      </div>

      <div className="dash-cols">
        <section className="card panel" aria-labelledby="recent">
          <div className="panel__head"><h2 id="recent">My recent articles</h2><Link to="/member/articles" className="btn btn--ghost btn--sm">View all</Link></div>
          <ul className="activity">
            {myArticles.map((a) => (
              <li key={a.id} style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{a.title}</span><StatusBadge status={a.status} />
              </li>
            ))}
          </ul>
        </section>

        <div className="stack">
          <section className="card panel" aria-labelledby="completion">
            <h2 id="completion" style={{ fontSize: '1.1rem' }}>Profile completion</h2>
            <div className="progress" role="progressbar" aria-valuenow={c.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion"><span style={{ width: `${c.percent}%` }} /></div>
            <p style={{ margin: '.75rem 0', color: 'var(--muted)' }}>{c.percent}% complete ({c.done} of {c.total} fields). {missing.length ? `Still missing: ${missing.map((m) => m.label.toLowerCase()).join(', ')}.` : 'Your profile is complete.'}</p>
            <Link to="/member/profile" className="btn btn--outline btn--sm">Update profile</Link>
          </section>
          <section className="card panel" aria-labelledby="act">
            <h2 id="act" style={{ fontSize: '1.1rem' }}>Recent activity</h2>
            <ul className="activity">{activities.map((a) => <li key={a}>{a}</li>)}</ul>
          </section>
        </div>
      </div>
    </>
  );
}
