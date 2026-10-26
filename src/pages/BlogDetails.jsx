import { Link, useParams } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { EmptyState } from '../components/ui';
import { posts } from '../data/mockData';

export default function BlogDetails() {
  const { id } = useParams();
  const post = posts.find((p) => String(p.id) === id);
  if (!post) {
    return <div className="section"><div className="container">
      <EmptyState icon="book" title="Article not found" message="It may have been unpublished."
        action={<Link to="/blog" className="btn btn--primary">Back to blog</Link>} /></div></div>;
  }
  const related = posts.filter((p) => p.id !== post.id).slice(0, 2);
  return (
    <>
      <PageHeader title={post.title}
        subtitle={`${post.author} · ${new Date(post.date).toLocaleDateString('en', { dateStyle: 'long' })}`}
        crumbs={[{ to: '/', label: 'Home' }, { to: '/blog', label: 'Blog' }, { label: post.category }]} />
      <div className="section"><div className="container detail">
        <article className="card detail__main prose">
          <span className="badge">{post.category}</span>
          <div style={{ marginTop: '1rem' }}>{post.content.map((p) => <p key={p}>{p}</p>)}</div>
        </article>
        <aside className="card detail__side" aria-label="More articles">
          <h3>More to read</h3>
          <ul className="detail__list">
            {related.map((r) => <li key={r.id}><Link to={`/blog/${r.id}`}>{r.title}</Link></li>)}
          </ul>
          <Link to="/blog" className="btn btn--outline btn--sm">All articles</Link>
        </aside>
      </div></div>
    </>
  );
}
