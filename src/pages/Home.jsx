import { Link } from 'react-router-dom';
import AlumniCard from '../components/AlumniCard';
import EventCard from '../components/EventCard';
import BlogCard from '../components/BlogCard';
import { Icon, EmptyState } from '../components/ui';
import HeroVideo from '../components/HeroVideo';
import AmbientBackground from '../components/AmbientBackground';
import { alumni as alumniData, events as eventsData, posts as postsData } from '../data/mockData';
import '../styles/home.css';

/**
 * Presentational home page. Pass real data from your existing fetch/state:
 *   <Home alumni={...} events={...} posts={...} stats={[{label, value}]} />
 * Sections with no data are hidden — nothing is invented.
 */
export default function Home({ alumni = alumniData, events = eventsData, posts = postsData, stats, headline, intro }) {
  const shownStats = stats || [
    { label: 'Sample alumni profiles', value: alumni.length },
    { label: 'Sample events', value: events.length },
    { label: 'Sample articles', value: posts.length },
  ];
  return (
    <div className="home">
      <AmbientBackground variant="page" />
      <section className="hero">
        <HeroVideo />
        <span className="hero__orb hero__orb--a" aria-hidden="true" /><span className="hero__orb hero__orb--b" aria-hidden="true" />
        <AmbientBackground variant="hero" />
        <div className="container hero__grid">
          <div className="hero__enter">
            <span className="eyebrow">Maharana Pratap Group of Institutions</span>
            <h1>{headline || 'Connecting Our Alumni. Inspiring the Next Generation.'}</h1>
            <p>{intro || 'Reconnect with your college community, celebrate achievements, discover opportunities, and build meaningful professional relationships.'}</p>
            <div className="hero__cta">
              <Link to="/login" className="btn btn--join">Join the Community <Icon name="arrow" size={18} /></Link>
              <Link to="/alumni" className="btn btn--on-dark">Explore Alumni</Link>
            </div>
          </div>
          <div className="hero__panel hero__enter" style={{ animationDelay: '.12s' }}>
            <h3>What you can do here</h3>
            <ul>
              <li><Icon name="users" /> Search the alumni directory by year and department</li>
              <li><Icon name="calendar" /> Register for reunions and events</li>
              <li><Icon name="briefcase" /> Find and share career opportunities</li>
              <li><Icon name="book" /> Publish articles and read success stories</li>
            </ul>
          </div>
        </div>
      </section>

      {shownStats.length > 0 && (
        <div className="container">
          <div className="stats">
            {shownStats.map((s) => (
              <div key={s.label} className="card stat">
                <div className="stat__value">{s.value}</div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {events.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head">
              <div><h2>Upcoming events</h2><p>Reunions, talks and meet-ups organised for alumni.</p></div>
              <Link to="/events" className="btn btn--outline btn--sm">All events</Link>
            </div>
            <div className="grid-3">{events.slice(0, 3).map((e) => <EventCard key={e.id ?? e._id} event={e} />)}</div>
          </div>
        </section>
      )}

      {alumni.length > 0 && (
        <section className="section section--white">
          <div className="container">
            <div className="section__head">
              <div><h2>Alumni spotlight</h2><p>Graduates making an impact in their fields.</p></div>
              <Link to="/alumni" className="btn btn--outline btn--sm">Full directory</Link>
            </div>
            <div className="grid-3">{alumni.slice(0, 3).map((a) => <AlumniCard key={a.id ?? a._id} alumni={a} />)}</div>
          </div>
        </section>
      )}

      {posts.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section__head">
              <div><h2>Stories from the community</h2><p>Articles written by alumni.</p></div>
              <Link to="/blog" className="btn btn--outline btn--sm">Read the blog</Link>
            </div>
            <div className="grid-3">{posts.slice(0, 3).map((p) => <BlogCard key={p.id ?? p._id} post={p} />)}</div>
          </div>
        </section>
      )}

      {!events.length && !alumni.length && !posts.length && (
        <section className="section"><div className="container"><EmptyState title="Content is on its way" message="Events, alumni and stories will appear here once they are published." /></div></section>
      )}

      <section className="section--tight">
        <div className="container">
          <div className="cta-band">
            <div><h2>Ready to reconnect?</h2><p>Try the demo: sign in to explore the alumni and administrator areas.</p></div>
            <Link to="/login" className="btn btn--light">Log in</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
