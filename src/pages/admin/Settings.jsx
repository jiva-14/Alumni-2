import { useId, useState } from 'react';
import { PreviewNote, Toggle } from '../../components/ui';

export default function Settings() {
  const uid = useId();
  const [form, setForm] = useState({ name: 'Alumni Portal', tagline: 'Stay connected with your university community', email: 'alumni@example.com' });
  const [flags, setFlags] = useState({ registration: true, approval: true, emailAlerts: true, maintenance: false });
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setSaved(false); setForm((f) => ({ ...f, [k]: e.target.value })); };
  const flip = (k) => (v) => { setSaved(false); setFlags((f) => ({ ...f, [k]: v })); };

  const ROWS = [
    ['registration', 'Open alumni registration', 'Let new alumni create accounts themselves.'],
    ['approval', 'Require approval for submissions', 'Articles, photos and opportunities are reviewed before publishing.'],
    ['emailAlerts', 'Email notifications', 'Send admins an email for new enquiries and approvals.'],
    ['maintenance', 'Maintenance mode', 'Show a maintenance notice to visitors.'],
  ];
  return (
    <>
      <div className="dash-head"><div><h1>Portal settings</h1><p>Branding, access rules and notifications.</p></div>
        <button className="btn btn--primary" onClick={() => setSaved(true)}>Save settings</button></div>
      <PreviewNote />
      {saved && <div className="alert alert--success" role="status" style={{ marginBottom: 'var(--space-4)' }}>Settings saved for this session.</div>}
      <div className="split">
        <section className="card panel">
          <div className="panel__head"><h2>General</h2></div>
          <div className="field"><label htmlFor={`${uid}n`}>Portal name</label><input id={`${uid}n`} className="input" value={form.name} onChange={set('name')} /></div>
          <div className="field"><label htmlFor={`${uid}t`}>Tagline</label><input id={`${uid}t`} className="input" value={form.tagline} onChange={set('tagline')} /></div>
          <div className="field"><label htmlFor={`${uid}e`}>Contact email</label><input id={`${uid}e`} type="email" className="input" value={form.email} onChange={set('email')} /></div>
        </section>
        <section className="card panel">
          <div className="panel__head"><h2>Access & notifications</h2></div>
          {ROWS.map(([k, t, d]) => (
            <div className="setting-row" key={k}><div><strong>{t}</strong><span>{d}</span></div><Toggle checked={flags[k]} onChange={flip(k)} label={t} /></div>
          ))}
        </section>
      </div>
    </>
  );
}
