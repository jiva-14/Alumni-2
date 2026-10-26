import { Link } from 'react-router-dom';
import { Icon, StatCard, StatusBadge, DataTable } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { alumni, approvals, events, gallery, opportunities, posts } from '../../data/mockData';
import { activityLogs, students } from '../../data/adminData';
import { AreaChart, BarChart, DonutChart } from '../../components/charts';

const QUICK = [
  { to: '/admin/alumni', icon: 'users', label: 'Add alumni' },
  { to: '/admin/events', icon: 'calendar', label: 'Create event' },
  { to: '/admin/announcements', icon: 'megaphone', label: 'Post announcement' },
  { to: '/admin/approvals', icon: 'check', label: 'Review approvals' },
  { to: '/admin/reports', icon: 'download', label: 'Export data' },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const pending = approvals.filter((a) => a.status === 'Pending');
  // Cumulative alumni by graduation year (derived from the directory data).
  const perYear = Object.entries(alumni.reduce((m, a) => ({ ...m, [a.graduationYear]: (m[a.graduationYear] || 0) + 1 }), {})).sort();
  let run = 0;
  const growth = perYear.map(([y, n]) => ({ label: String(y), value: (run += n) }));
  const eventBars = events.map((e) => ({ label: e.title, value: e.capacity }));
  const deptCounts = Object.entries(alumni.reduce((m, a) => ({ ...m, [a.department]: (m[a.department] || 0) + 1 }), {}));
  const dist = deptCounts.map(([label, value]) => ({ label, value }));

  return (
    <div className="stack">
      <section className="hero-card" aria-label="Welcome">
        <div>
          <h1>Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</h1>
          <p>{pending.length ? `${pending.length} submissions are waiting for your review.` : 'You are all caught up. Nothing is waiting for review.'}</p>
        </div>
        <Link to="/admin/approvals" className="btn btn--light"><Icon name="check" size={18} /> Review approvals</Link>
      </section>

      <div className="stat-grid" style={{ marginBottom: 0 }}>
        <StatCard tone="indigo" to="/admin/alumni" icon="users" label="Alumni" value={alumni.length} hint="in directory" />
        <StatCard tone="violet" to="/admin/students" icon="student" label="Students" value={students.length} hint="records" />
        <StatCard tone="teal" to="/admin/events" icon="calendar" label="Events" value={events.length} hint="scheduled" />
        <StatCard tone="sky" to="/admin/jobs" icon="briefcase" label="Jobs" value={opportunities.length} hint="open" />
        <StatCard tone="amber" to="/admin/blog" icon="news" label="Articles" value={posts.length} hint="published" />
        <StatCard tone="coral" to="/admin/approvals" icon="check" label="Pending approvals" value={pending.length} hint="need review" />
      </div>

      <div className="dash-cols">
        <section className="card panel" aria-labelledby="gr">
          <div className="panel__head"><h2 id="gr">Alumni growth</h2><span className="badge">Cumulative by graduation year</span></div>
          <AreaChart data={growth} unit=" alumni" color="#6366F1" />
        </section>
        <section className="card panel" aria-labelledby="dist">
          <div className="panel__head"><h2 id="dist">Alumni distribution</h2></div>
          <DonutChart data={dist} centerLabel="Alumni" />
        </section>
      </div>

      <section className="card panel" aria-labelledby="ev">
        <div className="panel__head"><h2 id="ev">Event capacity</h2><span className="badge badge--info">Registration counts need a backend</span></div>
        <BarChart data={eventBars} unit=" seats" />
      </section>

      <section className="card panel" aria-labelledby="pend">
        <div className="panel__head"><h2 id="pend">Waiting for review</h2><Link to="/admin/approvals" className="btn btn--outline btn--sm">Open approvals</Link></div>
        <DataTable emptyTitle="Nothing to review" rows={pending}
          columns={[{ key: 'type', header: 'Type' }, { key: 'title', header: 'Title' }, { key: 'submittedBy', header: 'Submitted by' }, { key: 'status', header: 'Status', render: (r) => <StatusBadge status={r.status} /> }]} />
      </section>

      <div className="dash-cols">
        <section className="card panel" aria-labelledby="qa">
          <h2 id="qa" style={{ fontSize: '1.05rem', marginBottom: 'var(--space-4)' }}>Quick actions</h2>
          <div className="quick-grid">
            {QUICK.map((q) => (
              <Link key={q.to} to={q.to} className="quick"><span className="quick__icon"><Icon name={q.icon} size={18} /></span>{q.label}</Link>
            ))}
          </div>
        </section>
        <section className="card panel" aria-labelledby="rec">
          <div className="panel__head"><h2 id="rec">Recent activity</h2><Link to="/admin/activity" className="btn btn--ghost btn--sm">View all</Link></div>
          <ul className="row-list">
            {activityLogs.slice(0, 4).map((a) => (
              <li key={a.id}>
                <span className="row-list__icon"><Icon name="activity" size={16} /></span>
                <span className="row-list__main"><strong>{a.action}</strong><span>{a.target}</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
