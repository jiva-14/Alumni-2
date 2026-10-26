import { useId, useState } from 'react';
import { alumni, departments } from '../../data/mockData';

const initial = alumni[0]; // sample profile; load the signed-in user's profile here

export default function MyProfile() {
  const uid = useId();
  const [form, setForm] = useState({ name: initial.name, email: initial.email, graduationYear: initial.graduationYear, department: initial.department, currentRole: initial.currentRole, company: initial.company, location: initial.location, bio: initial.bio });
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setSaved(false); setForm((s) => ({ ...s, [k]: e.target.value })); };

  const submit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) errs.email = 'Enter a valid email address';
    setErrors(errs);
    if (!Object.keys(errs).length) setSaved(true); // call your API here
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
      <form className="card panel" onSubmit={submit} noValidate>
        {saved && <div className="alert alert--success" role="status" style={{ marginBottom: 'var(--space-4)' }}>Profile saved.</div>}
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
