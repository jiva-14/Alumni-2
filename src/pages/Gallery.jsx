import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { Modal } from '../components/ui';
import { gallery } from '../data/mockData';

const CATS = ['All', ...new Set(gallery.map((g) => g.category))];

/* Tiles use gradient placeholders. When you have real photos, add an `image` field
   and render <img src={item.image} alt={item.title} /> inside .tile__art. */
export default function Gallery() {
  const [cat, setCat] = useState('All');
  const [active, setActive] = useState(null);
  const items = gallery.filter((g) => cat === 'All' || g.category === cat);

  return (
    <>
      <PageHeader title="Gallery" subtitle="Moments from reunions, events and campus life." crumbs={[{ to: '/', label: 'Home' }, { label: 'Gallery' }]} />
      <div className="section"><div className="container">
        <div className="tabs" role="group" aria-label="Filter by category">
          {CATS.map((c) => <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        <div className="gallery">
          {items.map((g) => (
            <div key={g.id} className="gallery__item">
              <button className={`tile${g.tall ? ' tile--tall' : ''}`} onClick={() => setActive(g)} aria-label={`View ${g.title}`}>
                <div className={`tile__art tone-${g.tone}`}>{g.title}</div>
              </button>
            </div>
          ))}
        </div>
      </div></div>
      <Modal open={!!active} onClose={() => setActive(null)} title={active?.title || ''}>
        {active && <div className={`tile__art tone-${active.tone}`} style={{ borderRadius: 12, color: '#fff', aspectRatio: '4 / 3' }} role="img" aria-label={active.title} />}
        {active && <p style={{ marginTop: '1rem' }}><span className="badge">{active.category}</span></p>}
      </Modal>
    </>
  );
}
