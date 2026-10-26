import { useMemo, useState } from 'react';
import SearchBar from '../../components/SearchBar';
import { DataTable } from '../../components/ui';
import { activityLogs } from '../../data/adminData';

export default function ActivityLogs() {
  const [q, setQ] = useState('');
  const [level, setLevel] = useState('All');
  const rows = useMemo(() => {
    const t = q.trim().toLowerCase();
    return activityLogs.filter((r) => (level === 'All' || r.level === level)
      && (!t || [r.actor, r.action, r.target].some((v) => v.toLowerCase().includes(t))));
  }, [q, level]);
  return (
    <>
      <div className="dash-head"><div><h1>Activity logs</h1><p>An audit trail of administrative actions.</p></div></div>
      <div className="tabs" role="group" aria-label="Filter by level">
        {['All', 'Info', 'Warning'].map((f) => <button key={f} className="tab" aria-pressed={level === f} onClick={() => setLevel(f)}>{f}</button>)}
      </div>
      <div className="card panel">
        <div className="table-tools"><SearchBar value={q} onChange={setQ} placeholder="Search logs" label="Search logs" /></div>
        <DataTable rows={rows} emptyTitle="No log entries"
          columns={[
            { key: 'time', header: 'Time' }, { key: 'actor', header: 'Actor' }, { key: 'action', header: 'Action' }, { key: 'target', header: 'Details' },
            { key: 'level', header: 'Level', render: (r) => <span className={`pill-level ${r.level}`}>{r.level}</span> },
          ]} />
      </div>
    </>
  );
}
