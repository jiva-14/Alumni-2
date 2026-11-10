import { useId, useRef, useState } from 'react';
import Avatar from '../../components/Avatar';
import { alumni, departments } from '../../data/mockData';
import { useToast } from '../../context/ToastContext';
import { completion, loadProfile, PROFILE_EVENT, PROFILE_KEY, readPhoto } from '../../utils/profile';

const initial = alumni[0]; // sample profile; load the signed-in user's profile here

export default function MyProfile() {
  const uid = useId();
  const [form, setForm] = useState(() => loadProfile({ name: initial.name, email: initial.email, graduationYear: initial.graduationYear, department: initial.department, currentRole: initial.currentRole, company: initial.company, location: initial.location, bio: initial.bio }));
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const toast = useToast();
  const fileRef = useRef(null);
  const pct = completion(form);
  const set = (k) => (e) => { setSaved(false); setForm((s) => ({ ...s, [k]: e.target.value })); };

  // The photo is stored straight away (it is not a typed field), and the sidebar is told to refresh.
  const savePhoto = (photo) => {
    try {
      const stored = JSON.parse(localStorage.getItem(PROFILE_KEY)) || {};
      if (photo) stored.photo = photo; else delete stored.photo;
      localStorage.setItem(PROFILE_KEY, JSON.stringify(stored));
      window.dispatchEvent(new Event(PROFILE_EVENT));
      return true;
    } catch { toast.error('Could not save the photo to browser storage.'); return false; }
  };
  const onPick = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    try {
      const photo = await readPhoto(file);
      if (savePhoto(photo)) { setForm((s) => ({ ...s, photo })); toast.success('Profile photo updated.'); }
    } catch (err) { toast.error(err.message); }
  };
  const removePhoto = () => { if (savePhoto(null)) { setForm((s) => ({ ...s, photo: undefined })); toast.success('Profile photo removed.'); } };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    setErrors(errs);
    if (Object.keys(errs).length) { toast.error('Please fix the highlighted fields.'); return; }
    try { localStorage.setItem(PROFILE_KEY, JSON.stringify(form)); setSaved(true); toast.success('Profile saved in this browser (demo).'); }
    catch { toast.error('Could not save to browser storage.'); }
  };

  const field = ({ name, label, full, children, type = 'text' }) => (
    <div key={name} className={`field${full ? ' field--full' : ''}`}>
      <label htmlFor={`${uid}-${name}`}>{label}</label>
      {children || <input id={`${uid}-${name}`} className="input" type={type} value={form[name]} onChange={set(name)} aria-invalid={!!errors[name]} />}
      {errors[name] && <span className="field__error">{errors[name]}</span>}
    </div>
  );

  return (
    <>
      <div className="dash-head"><div><h1>My profile</h1><p>Keep your details up to date so classmates can find you.</p></div></div>
      <section className="card panel profile-photo" aria-labelledby={`${uid}-photo`} style={{ marginBottom: 'var(--space-4)' }}>
        <Avatar name={form.name} src={form.photo} size="xl" label={form.photo ? 'Your profile picture' : 'No profile picture yet'} />
        <div className="profile-photo__body">
          <h2 id={`${uid}-photo`}>Profile photo</h2>
          <p>Shown beside your name in the alumni directory and your profile. Square images work best; JPG, PNG, WebP or GIF up to 5 MB.</p>
          <div className="profile-photo__actions">
            <input ref={fileRef} id={`${uid}-file`} type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={onPick} hidden />
            <button type="button" className="btn btn--outline btn--sm" onClick={() => fileRef.current?.click()}>{form.photo ? 'Change photo' : 'Upload photo'}</button>
            {form.photo && <button type="button" className="btn btn--ghost btn--sm" onClick={removePhoto}>Remove</button>}
          </div>
        </div>
      </section>
      <div className="card panel" style={{ marginBottom: 'var(--space-4)' }}><strong>Profile completion: {pct.percent}%</strong> <span style={{ color: 'var(--muted)' }}>({pct.done} of {pct.total} fields)</span><div className="progress" role="progressbar" aria-valuenow={pct.percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profile completion"><span style={{ width: `${pct.percent}%` }} /></div></div>
      <form className="card panel" onSubmit={submit} noValidate>
        {saved && <div className="alert alert--success" role="status" style={{ marginBottom: 'var(--space-4)' }}>Saved in this browser only. This is demo data and is not verified by the institution.</div>}
        <div className="form-grid">
          {field({ name: 'name', label: 'Full name' })}
          {field({ name: 'email', label: 'Email', type: 'email' })}
          {field({ name: 'graduationYear', label: 'Graduation year', type: 'number' })}
          {field({ name: 'department', label: 'Department', children: (
            <select id={`${uid}-department`} className="select" value={form.department} onChange={set('department')}>
              {departments.map((d) => <option key={d}>{d}</option>)}
            </select>
          ) })}
          {field({ name: 'currentRole', label: 'Current role' })}
          {field({ name: 'company', label: 'Company' })}
          {field({ name: 'location', label: 'Location', full: true })}
          {field({ name: 'bio', label: 'About you', full: true, children: (
            <textarea id={`${uid}-bio`} className="textarea" value={form.bio} onChange={set('bio')} />
          ) })}
        </div>
        <button type="submit" className="btn btn--primary">Save changes</button>
      </form>
    </>
  );
}
