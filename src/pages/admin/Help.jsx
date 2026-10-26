import { Icon } from '../../components/ui';
import { faqs } from '../../data/adminData';

export default function Help() {
  return (
    <>
      <div className="dash-head"><div><h1>Help & support</h1><p>Answers to common admin questions.</p></div></div>
      <div className="split">
        <section className="card panel">
          <div className="panel__head"><h2>Frequently asked questions</h2></div>
          {faqs.map((f) => (
            <details className="faq" key={f.q}><summary>{f.q}<Icon name="chevronD" size={18} /></summary><p>{f.a}</p></details>
          ))}
        </section>
        <section className="card panel">
          <div className="panel__head"><h2>Need more help?</h2></div>
          <p style={{ color: 'var(--muted)' }}>Contact the portal team and include the page you were on and what you expected to happen.</p>
          <a className="btn btn--primary" href="mailto:support@example.com?subject=Alumni%20Portal%20admin%20support"><Icon name="mail" size={18} /> Email support</a>
        </section>
      </div>
    </>
  );
}
