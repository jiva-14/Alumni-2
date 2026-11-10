import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/ui';
import Avatar from '../components/Avatar';
import { alumni } from '../data/mockData';
import { photoFor } from '../utils/profile';

export default function AlumniProfile() {
  const { id } = useParams();
  const person = alumni.find((a) => String(a.id) === id);

  if (!person) {
    return (
      <div className="section"><div className="container">
        <EmptyState icon="user" title="Profile not found" message="This alumni profile does not exist or was removed."
          action={<Link to="/alumni" className="btn btn--primary">Back to directory</Link>} />
      </div></div>
    );
  }

  return (
    <>
      <PageHeader title={person.name} subtitle={[person.currentRole, person.company].filter(Boolean).join(' at ')}
        crumbs={[{ to: '/', label: 'Home' }, { to: '/alumni', label: 'Alumni' }, { label: person.name }]} />
      <div className="section">
        <div className="container detail">
          <div className="stack">
            <section className="card card--pad">
              <div className="profile-top">
                <Avatar name={person.name} src={photoFor(person)} size="xl" label={`Profile picture of ${person.name}`} />
                <div className="chips">
                  <span className="badge">Class of {person.graduationYear}</span>
                  <span className="badge badge--info">{person.department}</span>
                  {person.location && <span className="badge badge--success">{person.location}</span>}
                </div>
              </div>
              {person.bio && <p style={{ marginTop: 'var(--space-4)' }}>{person.bio}</p>}
              {person.skills?.length > 0 && <div className="chips">{person.skills.map((s) => <span key={s} className="badge">{s}</span>)}</div>}
            </section>
            {person.experience?.length > 0 && (
              <section className="card card--pad"><h2>Experience</h2>
                <ul className="timeline">{person.experience.map((x) => <li key={x.role + x.period}><strong>{x.role}</strong> · {x.company}<small>{x.period}</small></li>)}</ul>
              </section>
            )}
            {person.education?.length > 0 && (
              <section className="card card--pad"><h2>Education</h2>
                <ul className="timeline">{person.education.map((x) => <li key={x.degree}><strong>{x.degree}</strong> · {x.school}<small>{x.period}</small></li>)}</ul>
              </section>
            )}
            {person.achievements?.length > 0 && (
              <section className="card card--pad"><h2>Achievements</h2>
                <ul>{person.achievements.map((a) => <li key={a}>{a}</li>)}</ul>
              </section>
            )}
          </div>
          <aside className="card detail__side" aria-label="Contact">
            <h3>Get in touch</h3>
            <p style={{ color: 'var(--muted)' }}>Reach out about mentoring, referrals or reunions.</p>
            {person.email && <a className="btn btn--primary" style={{ width: '100%' }} href={`mailto:${person.email}`}>Send an email</a>}
            <Link to="/alumni" className="btn btn--ghost" style={{ width: '100%', marginTop: '.5rem' }}>Back to directory</Link>
          </aside>
        </div>
      </div>
    </>
  );
}
