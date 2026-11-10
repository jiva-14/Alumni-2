import { Link } from 'react-router-dom';
import { Icon, StatCard, StatusBadge, DataTable } from '../../components/ui';
import { PersonCell } from '../../components/Avatar';
import { useAuth } from '../../context/AuthContext';
import { alumni, approvals, events, opportunities, posts } from '../../data/mockData';
import { activityLogs, students } from '../../data/adminData';
import { AreaChart } from '../../components/charts';
import { photoFor } from '../../utils/profile';

const fmtDate = (d) => new Date(d).toLocaleDateString('en', { day: 'numeric', month: 'short', year: 'numeric' });
const byName = Object.fromEntries(alumni.map((a) => [a.name, a]));

export default function AdminDashboard() {
  const { user } = useAuth();
  const pending = approvals.filter((a) => a.status === 'Pending');
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = events.filter((e) => e.date >= today).sort((a, b) => a.date.localeCompare(b.date));
  const nextEvents = (upcoming.length ? upcoming : events).slice(0, 4);
  const seats = events.reduce((n, e) => n + (e.capacity || 0), 0);
  const deptCount = new Set(alumni.map((a) => a.department)).size;

  // Cumulative alumni by graduation year (derived from the directory data).
  const dist = Object.entries(alumni.reduce((m, a) => ({ ...m, [a.department]: (m[a.department] || 0) + 1 }), {})).map(([label, value]) => ({ label, value }));
  const perYear = Object.entries(alumni.reduce((m, a) => ({ ...m, [a.graduationYear]: (m[a.graduationYear] || 0) + 1 }), {})).sort();
  let run = 0;
  const growth = perYear.map(([y, n]) => ({ label: String(y), value: (run += n) }));

  return (
    <div className="stack">
      <div className="dash-head">
        <div>
          <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p>{pending.length ? `${pending.length} submission${pending.length === 1 ? ' is' : 's are'} waiting for your review.` : 'You are all caught up. Nothing is waiting for review.'}</p>
        </div>
        <div className="dash-actions">
          <Link to="/admin/alumni" className="btn btn--outline btn--sm"><Icon name="users" size={16} /> Add alumni</Link>
          <Link to="/admin/events" className="btn btn--outline btn--sm"><Icon name="calendar" size={16} /> Create event</Link>
          <Link to="/admin/approvals" className="btn btn--primary btn--sm"><Icon name="check" size={16} /> Review approvals</Link>
        </div>
      </div>

      <div className="stat-grid stat-grid--3" style={{ marginBottom: 0 }}>
        <StatCard tone="indigo" to="/admin/alumni" icon="users" label="Alumni" value={alumni.length} hint={`${deptCount} departments`} />
        <StatCard tone="violet" to="/admin/students" icon="student" label="Students" value={students.length} hint="on record" />
        <StatCard tone="teal" to="/admin/events" icon="calendar" label="Upcoming events" value={upcoming.length || events.length} hint={`${seats.toLocaleString()} seats in total`} />
        <StatCard tone="sky" to="/admin/jobs" icon="briefcase" label="Open opportunities" value={opportunities.length} hint="jobs & internships" />
        <StatCard tone="amber" to="/admin/blog" icon="news" label="Published articles" value={posts.length} hint="news & blogs" />
        <StatCard tone="coral" to="/admin/approvals" icon="check" label="Pending approvals" value={pending.length} hint={pending.length ? 'need review' : 'all clear'} />
      </div>

      <div className="dash-cols">
        <section className="card panel" aria-labelledby="gr">
          <div className="panel__head"><h2 id="gr">Alumni growth</h2><span className="badge">Cumulative, by graduation year</span></div>
          <AreaChart data={growth} unit=" alumni" color="#294B91" />
        </section>
        <section className="card panel" aria-labelledby="dist">
          <div className="panel__head"><h2 id="dist">Alumni by department</h2></div>
          <ul className="row-list">
            {dist.map((d) => (
              <li key={d.label}><span className="row-list__main"><strong>{d.label}</strong></span><span className="badge">{d.value}</span></li>
            ))}
          </ul>
        </section>
      </div>

      <section className="card panel" aria-labelledby="pend">
        <div className="panel__head"><h2 id="pend">Waiting for review</h2><Link to="/admin/approvals" className="btn btn--outline btn--sm">Open approvals</Link></div>
        <DataTable emptyTitle="Nothing to review" caption="Submissions waiting for review" rows={pending}
          columns={[
            { key: 'type', header: 'Type' },
            { key: 'title', header: 'Title' },
            { key: 'submittedBy', header: 'Submitted by', render: (r) => <PersonCell name={r.submittedBy} src={photoFor(byName[r.submittedBy])} /> },
            { key: 'date', header: 'Date', render: (r) => fmtDate(r.date) },
            { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> },
          ]} />
      </section>

      <div className="dash-cols dash-cols--even">
        <section className="card panel" aria-labelledby="ue">
          <div className="panel__head"><h2 id="ue">Upcoming events</h2><Link to="/admin/events" className="btn btn--ghost btn--sm">Manage</Link></div>
          <DataTable caption="Upcoming events" rows={nextEvents}
            columns={[
              { key: 'title', header: 'Event', render: (r) => <span className="cell-stack"><strong>{r.title}</strong><small>{fmtDate(r.date)} · {r.location}</small></span> },
              { key: 'capacity', header: 'Seats' },
            ]} />
        </section>
        <section className="card panel" aria-labelledby="rec">
          <div className="panel__head"><h2 id="rec">Recent activity</h2><Link to="/admin/activity" className="btn btn--ghost btn--sm">View all</Link></div>
          <DataTable caption="Recent activity" rows={activityLogs.slice(0, 5)}
            columns={[
              { key: 'action', header: 'Action', render: (r) => <span className="cell-stack"><strong>{r.action}</strong><small>{r.target} · {r.actor}</small></span> },
              { key: 'time', header: 'When', render: (r) => fmtDate(r.time.slice(0, 10)) },
            ]} />
        </section>
      </div>
    </div>
  );
}
