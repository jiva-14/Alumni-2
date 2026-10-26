import '../styles/eyes.css';

/** Small decorative eyes. Purely visual (aria-hidden); state comes from utils/eyeState.js. */
export default function PasswordEyes({ closed = false, look = 'center' }) {
  return (
    <span className={`eyes eyes--${look}${closed ? ' is-closed' : ''}`} aria-hidden="true" data-eyes={closed ? 'closed' : 'open'}>
      {[0, 1].map((i) => (
        <span className="eye" key={i}>
          <span className="eye__pupil" />
          <span className="eye__lid" />
        </span>
      ))}
    </span>
  );
}
