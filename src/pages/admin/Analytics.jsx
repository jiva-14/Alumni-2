import { alumni, opportunities } from '../../data/mockData';
import { engagement } from '../../data/adminData';
import { StatCard } from '../../components/ui';
import { AreaChart, BarChart, DonutChart } from '../../components/charts';

function HBars({ rows }) {
  const max = Math.max(...rows.map(([, n]) => n), 1);
  return (
    <div className="hbars">
      {rows.map(([label, n]) => (
        <div className="hbar" key={label}><span>{label}</span><div className="hbar__track"><span style={{ width: `${(n / max) * 100}%` }} /></div><strong>{n}</strong></div>
      ))}
    </div>
  );
}

const count = (arr, fn) => Object.entries(arr.reduce((m, a) => ({ ...m, [fn(a)]: (m[fn(a)] || 0) + 1 }), {})).sort((a, b) => b[1] - a[1]);

export default function Analytics() {
  const last = engagement[engagement.length - 1], prev = engagement[engagement.length - 2];
  const growth = Math.round(((last.visits - prev.visits) / prev.visits) * 100);
  const signups = engagement.reduce((s, d) => s + d.signups, 0);
  return (
    <>
      <div className="dash-head"><div><h1>Analytics</h1><p>Engagement and community insights. Visits and sign-ups are sample values; real analytics need a backend.</p></div></div>
      <div className="stat-grid">
        <StatCard tone="indigo" icon="eye" label="Visits this month" value={last.visits.toLocaleString()} trend={`+${growth}%`} hint="vs last month" />
        <StatCard tone="teal" icon="users" label="Sign-ups (6 months)" value={signups} />
        <StatCard tone="amber" icon="briefcase" label="Open opportunities" value={opportunities.length} />
      </div>
      <div className="split">
        <section className="card panel"><div className="panel__head"><h2>Portal visits <span className="badge">Sample</span></h2></div>
          <AreaChart data={engagement.map((d) => ({ label: d.m, value: d.visits }))} color="#6366F1" unit=" visits" /></section>
        <section className="card panel"><div className="panel__head"><h2>New sign-ups <span className="badge">Sample</span></h2></div>
          <BarChart data={engagement.map((d) => ({ label: d.m, value: d.signups }))} unit=" sign-ups" /></section>
        <section className="card panel"><div className="panel__head"><h2>Alumni by department</h2></div>
          <DonutChart data={count(alumni, (a) => a.department).map(([label, value]) => ({ label, value }))} centerLabel="Alumni" /></section>
        <section className="card panel"><div className="panel__head"><h2>Alumni by city</h2></div>
          <HBars rows={count(alumni, (a) => a.location)} /></section>
      </div>
    </>
  );
}
