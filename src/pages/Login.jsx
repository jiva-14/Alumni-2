import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Icon } from '../components/ui';
import PasswordEyes from '../components/PasswordEyes';
import AmbientBackground from '../components/AmbientBackground';
import { getEyeState } from '../utils/eyeState';
import { useToast } from '../context/ToastContext';
import '../styles/directory.css';

const ROLES = [
  { id: 'alumni', label: 'Alumni', hint: 'Profile, articles, opportunities', icon: 'users' },
  { id: 'admin', label: 'Administrator', hint: 'Manage the portal', icon: 'shield' },
];

/** UI-only login. There is no backend: it validates the form, then signs in with the selected role.
    Replace the body of onSubmit with your real authentication call. */
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [role, setRole] = useState('alumni');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [pwFocus, setPwFocus] = useState(false);     // focus is on the password input or its show/hide button
  const [emailFocus, setEmailFocus] = useState(false);
  const eyes = getEyeState({ passwordFocused: pwFocus, showPassword: show, emailFocused: emailFocus });
  const [errors, setErrors] = useState({});

  const onSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Enter a valid email address';
    if (password.length < 6) errs.password = 'Password must be at least 6 characters';
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error('Please correct the highlighted fields.'); return; }
    login({ email, role, name: email.split('@')[0] });
    const home = role === 'admin' ? '/admin' : '/member';
    navigate(location.state?.from?.startsWith(home) ? location.state.from : home, { replace: true });
  };

  return (
    <div className="auth">
      <div className="auth__bg" aria-hidden="true">
        <span className="auth__shape auth__shape--a" /><span className="auth__shape auth__shape--b" />
        <span className="auth__shape auth__shape--c" /><span className="auth__shape auth__shape--d" />
        <AmbientBackground variant="auth" />
      </div>
      <div className="auth__wrap">
        <aside className="auth__aside">
          <span className="auth__logo" aria-hidden="true">A</span>
          <h2>Welcome to your alumni network</h2>
          <p>Reconnect with classmates, share your story and discover opportunities.</p>
          <ul>
            <li><Icon name="users" size={18} /> Alumni directory</li>
            <li><Icon name="calendar" size={18} /> Reunions &amp; events</li>
            <li><Icon name="briefcase" size={18} /> Career opportunities</li>
          </ul>
        </aside>
        <div className="auth__card">
          <h1>Sign in</h1>
          <p className="auth__sub">Choose how you want to continue.</p>
          <form onSubmit={onSubmit} noValidate>
            <div className="auth__roles" role="radiogroup" aria-label="Sign in as">
              {ROLES.map((r) => (
                <button key={r.id} type="button" role="radio" aria-checked={role === r.id} className={`role${role === r.id ? ' on' : ''}`} onClick={() => setRole(r.id)}>
                  <span className="role__icon"><Icon name={r.icon} size={20} /></span>
                  <span className="role__text"><strong>{r.label}</strong><small>{r.hint}</small></span>
                </button>
              ))}
            </div>
            <div className="field">
              <label htmlFor="email">Email</label>
              <input id="email" className="input" type="email" autoComplete="email" placeholder="you@example.com" value={email}
                onChange={(e) => setEmail(e.target.value)} onFocus={() => setEmailFocus(true)} onBlur={() => setEmailFocus(false)} aria-invalid={!!errors.email} aria-describedby={errors.email ? 'email-err' : undefined} />
              {errors.email && <span id="email-err" className="field__error" role="alert">{errors.email}</span>}
            </div>
            <div className="field">
              <div className="field__row">
                <label htmlFor="password">Password</label>
                <PasswordEyes closed={eyes.closed} look={eyes.look} />
              </div>
              <div className="pw" onFocus={() => setPwFocus(true)} onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setPwFocus(false); }}>
                <input id="password" className="input" type={show ? 'text' : 'password'} autoComplete="current-password" placeholder="At least 6 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} aria-invalid={!!errors.password} aria-describedby={errors.password ? 'pw-err' : undefined} />
                <button type="button" className="pw__toggle" onClick={() => setShow((v) => !v)} aria-label={show ? 'Hide password' : 'Show password'} aria-pressed={show}>
                  <Icon name={show ? 'eyeOff' : 'eye'} size={18} />
                </button>
              </div>
              {errors.password && <span id="pw-err" className="field__error" role="alert">{errors.password}</span>}
            </div>
            <button type="submit" className="btn btn--primary btn--lg" style={{ width: '100%' }}>
              Sign in as {role === 'admin' ? 'Administrator' : 'Alumni'} <Icon name="arrow" size={18} />
            </button>
          </form>
          <p className="auth__note"><Icon name="sparkle" size={14} /> Preview mode: no server or real authentication is connected, so any valid-looking email and a 6+ character password will sign you in. Connect a backend before real use.</p>
        </div>
      </div>
    </div>
  );
}
