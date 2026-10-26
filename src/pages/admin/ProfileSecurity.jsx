import { useId, useState } from 'react';
import { PreviewNote, Toggle } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';

export default function ProfileSecurity() {
  const uid = useId();
  const { user } = useAuth();
  const [profile, setProfile] = useState({ name: user?.name || 'Portal Administrator', email: user?.email || 'admin@example.com', phone: '' });
  const [pw, setPw] = useState({ current: '', next: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [msg, setMsg] = useState('');
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState([
    { id: 1, device: 'This browser', place: 'Current session', current: true },
    { id: 2, device: 'Chrome on Windows', place: 'Lucknow, IN', current: false },
    { id: 3, device: 'Safari on iPhone', place: 'Delhi, IN', current: false },
  ]);

  const changePw = (e) => {
    e.preventDefault();
    const er = {};
    if (!pw.current) er.current = 'Enter your current password';
    if (pw.next.length < 8) er.next = 'Use at least 8 characters';
    if (pw.confirm !== pw.next) er.confirm = 'Passwords do not match';
    setErrors(er);
    if (Object.keys(er).length) return;
    setPw({ current: '', next: '', confirm: '' });
    setMsg('Password form validated. A backend is needed to actually change it.');
  };

  const field = (k, label, type = 'text') => (
    <div className="field"><label htmlFor={`${uid}${k}`}>{label}</label>
      <input id={`${uid}${k}`} type={type} className="input" value={pw[k]} aria-invalid={!!errors[k]}
        onChange={(e) => setPw((p) => ({ ...p, [k]: e.target.value }))} autoComplete={k === 'current' ? 'current-password' : 'new-password'} />
      {errors[k] && <span className="field__error">{errors[k]}</span>}</div>
  );

  return (
    <>
      <div className="dash-head"><div><h1>Profile & security</h1><p>Your account details and sign-in protection.</p></div></div>
      <PreviewNote>Preview only: profile and security changes are not stored until a backend is connected.</PreviewNote>
      {msg && <div className="alert alert--success" role="status" style={{ marginBottom: 'var(--space-4)' }}>{msg}</div>}
      <div className="split">
        <section className="card panel">
          <div className="panel__head"><h2>Profile</h2></div>
          <div className="field"><label htmlFor={`${uid}pn`}>Full name</label><input id={`${uid}pn`} className="input" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></div>
          <div className="field"><label htmlFor={`${uid}pe`}>Email</label><input id={`${uid}pe`} type="email" className="input" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} /></div>
          <div className="field"><label htmlFor={`${uid}pp`}>Phone</label><input id={`${uid}pp`} type="tel" className="input" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /></div>
          <button className="btn btn--primary" onClick={() => setMsg('Profile updated for this session.')}>Save profile</button>
        </section>
        <section className="card panel">
          <div className="panel__head"><h2>Change password</h2></div>
          <form onSubmit={changePw} noValidate>
            {field('current', 'Current password', 'password')}
            {field('next', 'New password', 'password')}
            {field('confirm', 'Confirm new password', 'password')}
            <button type="submit" className="btn btn--primary">Update password</button>
          </form>
        </section>
        <section className="card panel">
          <div className="panel__head"><h2>Two-factor authentication</h2></div>
          <div className="setting-row"><div><strong>Authenticator app</strong><span>Ask for a code at sign-in. Needs backend support to enforce.</span></div><Toggle checked={twoFA} onChange={setTwoFA} label="Two-factor authentication" /></div>
        </section>
        <section className="card panel">
          <div className="panel__head"><h2>Active sessions</h2></div>
          <ul className="row-list">
            {sessions.map((s) => (
              <li key={s.id}><span className="row-list__main"><strong>{s.device}</strong><span>{s.place}</span></span>
                {s.current ? <span className="badge badge--success">Current</span> : <button className="btn btn--outline btn--sm" onClick={() => setSessions((l) => l.filter((x) => x.id !== s.id))}>Sign out</button>}</li>
            ))}
          </ul>
        </section>
      </div>
    </>
  );
}
