import { Link } from 'react-router-dom';
import { Icon, StatCard, StatusBadge } from '../../components/ui';
import Avatar from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import { activities, alumni, events, myArticles, opportunities } from '../../data/mockData';
import { completion, loadProfile } from '../../utils/profile';

const fmt = (d) => new Date(d).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
const greeting = () => { const h = new Date().getHours(); return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'; };

/* Shortcuts: each says what it does, so a first-time member knows where to go. */
const SHORTCUTS = [
  { to: '/member/articles', icon: 'book', title: 'Write an article', text: 'Share a career lesson or community story.' },
  { to: '/member/opportunities', icon: 'briefcase', title: 'Find opportunities', text: 'Jobs and internships posted by alumni.' },
  { to: '/member/events', icon: 'calendar', title: 'Browse events', text: 'Reunions, talks and meet-ups to join.' },
  { to: '/alumni', icon: 'users', title: 'Alumni directory', text: 'Find classmates and fellow graduates.' },
];

export default function AlumniDashboard() {
  const { user } = useAuth();
  const me = loadProfile(alumni[0]);
  const c = completion(me);
  const missing = c.items.filter((i) => !i.done);
  const first = (me.name || user?.name || '').split(' ')[0];
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const nextEvents = (upcoming.length ? upcoming : events).slice(0, 3);
  const published = myArticles.filter((a) => a.status === 'Published').length;
  const waiting = myArticles.filter((a) => a.status === 'Pending').length;
  const drafts = myArticles.filter((a) => a.status === 'Draft').length;
  const headline = [me.currentRole, me.company].filter(Boolean).join(' at ');

  return (
    <div className="stack alum">
      <section className="welcome" aria-label="Welcome">
        <Avatar name={me.name} src={me.photo} size="lg" className="welcome__ava" />
        <div className="welcome__body">
          <p className="welcome__kicker">{greeting()}</p>
          <h1>Welcome back, {first}</h1>
          <p className="welcome__meta">
            {[me.graduationYear && `Class of ${me.graduationYear}`, me.department, me.location].filter(Boolean).join(' · ')}
          </p>
          {headline && <p className="welcome__role">{headline}</p>}
        </div>
        <div className="welcome__actions">
          <Link to="/member/articles" className="btn btn--light btn--sm"><Icon name="book" size={16} /> Write an article</Link>
          <Link to="/member/profile" className="btn btn--on-dark btn--sm">Edit profile</Link>
        </div>
      </section>

      <div className="stat-grid stat-grid--4" style={{ marginBottom: 0 }}>
        <StatCard tone="indigo" to="/member/articles" icon="book" label="Published articles" value={published} hint={drafts ? `${drafts} draft${drafts > 1 ? 's' : ''} saved` : 'visible to alumni'} />
        <StatCard tone="amber" to="/member/articles" icon="check" label="Awaiting review" value={waiting} hint={waiting ? 'with the alumni office' : 'nothing pending'} />
        <StatCard tone="teal" to="/member/events" icon="calendar" label="Upcoming events" value={upcoming.length || events.length} hint={nextEvents[0] ? `Next: ${fmt(nextEvents[0].date)}` : 'none scheduled'} />
        <StatCard tone="sky" to="/member/opportunities" icon="briefcase" label="Open opportunities" value={opportunities.length} hint="jobs & internships" />
      </div>

      <div className="dash-cols">
        <div className="stack">
          <section className="card panel" aria-labelledby="recent">
            <div className="panel__head">
              <div><h2 id="recent">My articles</h2><p className="panel__sub">What you have written and where each piece stands.</p></div>
              <Link to="/member/articles" className="btn btn--outline btn--sm">Manage</Link>
            </div>
            <ul className="row-list">
              {myArticles.map((a) => (
                <li key={a.id}>
                  <span className="row-list__icon"><Icon name="book" size={16} /></span>
                  <span className="row-list__main"><strong>{a.title}</strong><span>{a.category} · {fmt(a.date)}</span></span>
                  <StatusBadge status={a.status} />
                </li>
              ))}
            </ul>
          </section>

          <section className="card panel" aria-labelledby="up">
            <div className="panel__head">
              <div><h2 id="up">Upcoming events</h2><p className="panel__sub">Reunions, talks and meet-ups open to alumni.</p></div>
              <Link to="/member/events" className="btn btn--outline btn--sm">All events</Link>
            </div>
            <ul className="row-list">
              {nextEvents.map((e) => (
                <li key={e.id}>
                  <span className="date-chip" aria-hidden="true"><b>{new Date(e.date).toLocaleDateString('en', { day: 'numeric' })}</b>{new Date(e.date).toLocaleDateString('en', { month: 'short' })}</span>
                  <span className="row-list__main"><strong>{e.title}</strong><span>{e.time} · {e.location}</span></span>
                  <Link to={`/events/${e.id}`} className="btn btn--ghost btn--sm">Details</Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card panel" aria-labelledby="latest">
            <div className="panel__head">
              <div><h2 id="latest">Career opportunities</h2><p className="panel__sub">Roles shared by the MPGI alumni network.</p></div>
              <Link to="/member/opportunities" className="btn btn--outline btn--sm">Browse all</Link>
            </div>
            <ul className="row-list">
              {opportunities.slice(0, 3).map((o) => (
                <li key={o.id}>
                  <span className="row-list__icon row-list__icon--sky"><Icon name="briefcase" size={16} /></span>
                  <span className="row-list__main"><strong>{o.title}</strong><span>{o.company} · {o.location}</span></span>
                  <span className="badge">{o.type}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <aside className="stack" aria-label="Profile and shortcuts">
          <section className="card panel" aria-labelledby="completion">
            <div className="panel__head"><h2 id="completion">Profile strength</h2><strong className="pct">{c.percent}%</strong></div>
            <div className="progress" role="progressbar" aria-valuenow={c.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion"><span style={{ width: `${c.percent}%` }} /></div>
            <p className="panel__note">
              {missing.length ? `Add ${missing.slice(0, 3).map((m) => m.label.toLowerCase()).join(', ')}${missing.length > 3 ? ' and more' : ''} to complete your profile.` : 'Your profile is complete, so classmates can find you easily.'}
              {!me.photo && ' A profile photo helps people recognise you.'}
            </p>
            <Link to="/member/profile" className="btn btn--outline btn--sm">{me.photo ? 'Update profile' : 'Add photo & details'}</Link>
          </section>

          <section className="card panel" aria-labelledby="short">
            <h2 id="short" className="panel__title">Quick links</h2>
            <ul className="shortcuts">
              {SHORTCUTS.map((s) => (
                <li key={s.to}>
                  <Link to={s.to} className="shortcut">
                    <span className="shortcut__icon"><Icon name={s.icon} size={18} /></span>
                    <span className="shortcut__text"><strong>{s.title}</strong><small>{s.text}</small></span>
                    <Icon name="arrow" size={16} />
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          <section className="card panel" aria-labelledby="act">
            <h2 id="act" className="panel__title">Recent activity</h2>
            <ul className="timeline">{activities.map((a) => <li key={a}>{a}</li>)}</ul>
          </section>
        </aside>
      </div>
    </div>
  );
}
