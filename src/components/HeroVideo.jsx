import { useEffect, useRef, useState } from 'react';
import { useHeroVideo, youtubeId, validateSource } from '../utils/heroVideo';
import '../styles/herovideo.css';

/** Presentational background media. Used by the hero and by the admin preview. */
export function HeroMedia({ config, className = '', allowBlob = false }) {
  const [failed, setFailed] = useState(false);
  const still = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const src = (config?.url || '').trim();
  useEffect(() => setFailed(false), [src]);
  const blobOk = allowBlob && src.startsWith('blob:');
  if (!config?.enabled || !src || (validateSource(src) && !blobOk)) return null;
  const yt = youtubeId(src);
  return (
    <div className={`hv ${className}`} style={{ '--o': (config.overlay ?? 45) / 100 }} aria-hidden="true">
      {config.poster && <img className="hv__poster" src={config.poster} alt="" />}
      {!still && !failed && (yt
        ? <iframe className="hv__yt" title="Background video" tabIndex={-1} allow="autoplay; encrypted-media" loading="lazy"
            src={`https://www.youtube-nocookie.com/embed/${yt}?autoplay=1&mute=1&controls=0&loop=1&playlist=${yt}&modestbranding=1&playsinline=1&rel=0&disablekb=1`} />
        : <video className="hv__video" src={src} poster={config.poster || undefined} autoPlay muted loop playsInline preload="metadata" onError={() => setFailed(true)} />)}
      <div className="hv__shade" />
    </div>
  );
}

/** Drop-in for the public hero: reads the saved config and flags the hero section. */
export default function HeroVideo() {
  const { config } = useHeroVideo();
  const ref = useRef(null);
  const on = !!(config.enabled && config.url && !validateSource(config.url));
  useEffect(() => {
    const hero = ref.current?.closest('.hero');
    if (hero) hero.classList.toggle('has-video', on);
    return () => hero && hero.classList.remove('has-video');
  }, [on]);
  return <span ref={ref} style={{ display: 'contents' }}><HeroMedia config={config} /></span>;
}
