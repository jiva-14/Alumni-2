import { useState } from 'react';
import { Icon, EmptyState } from '../../components/ui';
import { notifications as seed } from '../../data/adminData';

const ICON = { approval: 'check', enquiry: 'mail', event: 'calendar', system: 'shield' };

export default function Notifications() {
  const [items, setItems] = useState(seed);
  const [filter, setFilter] = useState('All');
  const unread = items.filter((n) => !n.read).length;
  const rows = items.filter((n) => filter === 'All' || (filter === 'Unread' ? !n.read : n.read));
  const toggle = (id) => setItems((l) => l.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));

  return (
    <>
      <div className="dash-head">
        <div><h1>Notifications</h1><p>{unread ? `${unread} unread` : 'You are all caught up.'}</p></div>
        <button className="btn btn--outline" disabled={!unread} onClick={() => setItems((l) => l.map((n) => ({ ...n, read: true })))}>Mark all as read</button>
      </div>
      <div className="tabs" role="group" aria-label="Filter notifications">
        {['All', 'Unread', 'Read'].map((f) => <button key={f} className="tab" aria-pressed={filter === f} onClick={() => setFilter(f)}>{f}</button>)}
      </div>
      <div className="card">
        {rows.length ? rows.map((n) => (
          <div key={n.id} className={`notif${n.read ? '' : ' unread'}`}>
            <span className="row-list__icon"><Icon name={ICON[n.type] || 'bell'} size={18} /></span>
            <div style={{ flex: 1 }}><div className="notif__title">{n.title}</div><div className="notif__detail">{n.detail}</div><small style={{ color: 'var(--muted)' }}>{n.time}</small></div>
            <button className="btn btn--ghost btn--sm" onClick={() => toggle(n.id)}>{n.read ? 'Mark unread' : 'Mark read'}</button>
          </div>
        )) : <EmptyState icon="bell" title="No notifications" message="Nothing matches this filter." />}
      </div>
    </>
  );
}
