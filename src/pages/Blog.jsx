import { useMemo, useState } from 'react';
import PageHeader from '../components/PageHeader';
import SearchBar from '../components/SearchBar';
import BlogCard from '../components/BlogCard';
import { EmptyState } from '../components/ui';
import { posts } from '../data/mockData';

const CATS = ['All', ...new Set(posts.map((p) => p.category))];

export default function Blog() {
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('All');
  const list = useMemo(() => {
    const t = q.trim().toLowerCase();
    return posts
      .filter((p) => cat === 'All' || p.category === cat)
      .filter((p) => !t || `${p.title} ${p.excerpt} ${p.author}`.toLowerCase().includes(t))
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [q, cat]);

  return (
    <>
      <PageHeader title="Blog" subtitle="Stories and advice written by alumni." crumbs={[{ to: '/', label: 'Home' }, { label: 'Blog' }]} />
      <div className="section"><div className="container">
        <div className="toolbar"><SearchBar value={q} onChange={setQ} placeholder="Search articles" label="Search articles" /></div>
        <div className="tabs" role="group" aria-label="Filter by category">
          {CATS.map((c) => <button key={c} className="tab" aria-pressed={cat === c} onClick={() => setCat(c)}>{c}</button>)}
        </div>
        {list.length === 0
          ? <EmptyState icon="book" title="No articles found" message="Try another category or search term." />
          : <div className="grid-3">{list.map((p) => <BlogCard key={p.id} post={p} />)}</div>}
      </div></div>
    </>
  );
}
