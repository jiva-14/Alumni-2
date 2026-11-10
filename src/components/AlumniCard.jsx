import { Link } from 'react-router-dom';
import Avatar from './Avatar';
import { photoFor } from '../utils/profile';
import '../styles/directory.css';

/**
 * Renders only the fields that exist on the object.
 * Map your own field names in the `pick` helpers below if they differ.
 */
export default function AlumniCard({ alumni, to }) {
  const name = alumni.name || alumni.fullName;
  const photo = photoFor(alumni);
  const year = alumni.graduationYear || alumni.batch || alumni.year;
  const role = alumni.currentRole || alumni.role || alumni.designation;
  const company = alumni.company || alumni.organization;
  const dept = alumni.department || alumni.branch;
  const link = to || `/alumni/${alumni.id ?? alumni._id}`;

  return (
    <article className="card card--hover alumni-card">
      <div className="alumni-card__top">
        <Avatar name={name} src={photo} size="md" />
        <div>
          <h3>{name}</h3>
          {(role || company) && <p className="alumni-card__role">{[role, company].filter(Boolean).join(' at ')}</p>}
        </div>
      </div>
      {(year || dept) && (
        <div className="alumni-card__tags">
          {year && <span className="badge">Class of {year}</span>}
          {dept && <span className="badge badge--info">{dept}</span>}
        </div>
      )}
      <Link to={link} className="btn btn--outline btn--sm">View profile</Link>
    </article>
  );
}
