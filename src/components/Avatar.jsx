import { useEffect, useState } from 'react';

const initialsOf = (name = '') => name.replace(/^(dr|prof|mr|ms|mrs)\.?\s+/i, '').split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';
// Calm, on-brand tints for the fallback avatar. The same name always gets the same tint.
const TONES = ['t1', 't2', 't3', 't4', 't5'];
const toneOf = (name = '') => TONES[[...name].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7) % TONES.length];

/**
 * Circular profile picture with a graceful fallback.
 * - `src`: uploaded photo (URL or data URL). If missing or it fails to load, initials are shown instead.
 * - `size`: 'xs' 28px | 'sm' 36px | 'md' 48px (default) | 'lg' 72px | 'xl' 96px, or a number of px.
 * Decorative by default (the name is almost always printed next to it); pass `label` to announce it.
 */
export default function Avatar({ name = '', src, size = 'md', label, className = '' }) {
  const [broken, setBroken] = useState(false);
  useEffect(() => setBroken(false), [src]);
  const px = typeof size === 'number' ? size : undefined;
  const style = px ? { '--ava-size': `${px}px` } : undefined;
  const cls = `ava ava--${px ? 'custom' : size} ava--${toneOf(name)} ${className}`.trim();
  const showImg = src && !broken;
  return (
    <span className={cls} style={style} role={label ? 'img' : undefined} aria-label={label} aria-hidden={label ? undefined : 'true'}>
      {showImg
        ? <img src={src} alt="" loading="lazy" decoding="async" draggable="false" onError={() => setBroken(true)} />
        : <span className="ava__txt">{initialsOf(name)}</span>}
    </span>
  );
}

/** Avatar + name (+ optional second line) for table cells and lists. */
export function PersonCell({ name, src, sub, size = 'sm' }) {
  return (
    <span className="person">
      <Avatar name={name} src={src} size={size} />
      <span className="person__text"><strong>{name}</strong>{sub && <small>{sub}</small>}</span>
    </span>
  );
}
