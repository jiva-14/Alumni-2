import { Link } from 'react-router-dom';
import '../styles/directory.css';

export default function BlogCard({ post, to }) {
  const image = post.image || post.cover || post.thumbnail;
  const excerpt = post.excerpt || post.summary || post.description;
  const author = post.author?.name || post.author;
  const d = post.date || post.createdAt ? new Date(post.date || post.createdAt) : null;
  const valid = d && !Number.isNaN(d.getTime());
  const link = to || `/blog/${post.id ?? post._id}`;

  return (
    <article className="card card--hover media-card">
      {image
        ? <img className="media-card__img" src={image} alt={`Cover for ${post.title}`} loading="lazy" />
        : <div className="media-card__img" role="img" aria-label="" />}
      <div className="media-card__body">
        {post.category && <span className="badge" style={{ alignSelf: 'flex-start' }}>{post.category}</span>}
        <h3>{post.title}</h3>
        {excerpt && <p>{excerpt}</p>}
        <div className="media-card__meta">
          {author && <span>{author}</span>}
          {valid && <time dateTime={d.toISOString()}>{d.toLocaleDateString('en', { dateStyle: 'medium' })}</time>}
        </div>
        <Link to={link} className="btn btn--ghost btn--sm">Read article</Link>
      </div>
    </article>
  );
}
