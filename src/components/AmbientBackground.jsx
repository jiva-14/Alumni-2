import '../styles/ambient.css';

/* Subtle ambient background: soft drifting glows, a few light particles and thin geometric shapes.
   Decorative only (aria-hidden, pointer-events: none). Colors/opacity are CSS variables in ambient.css. */

// [left %, top %, size px, duration s, delay s]
const PARTICLES = {
  hero: [[8, 22, 5, 14, 0], [18, 70, 4, 17, 3], [27, 38, 3, 12, 6], [36, 82, 5, 16, 2], [47, 18, 3, 13, 8], [58, 60, 4, 18, 5],
    [66, 30, 5, 15, 1], [74, 78, 3, 12, 9], [83, 16, 4, 16, 4], [91, 52, 5, 14, 7], [95, 86, 3, 17, 10], [12, 48, 3, 13, 11],
    [4, 60, 4, 15, 2], [22, 10, 5, 13, 5], [42, 55, 4, 17, 9], [54, 90, 5, 14, 3], [70, 8, 4, 16, 6], [88, 35, 5, 15, 12], [97, 70, 4, 13, 1], [31, 25, 3, 18, 4]],
  page: [[6, 12, 5, 18, 0], [20, 34, 4, 15, 4], [34, 58, 5, 19, 8], [48, 20, 3, 14, 2], [62, 46, 4, 17, 6], [76, 70, 5, 20, 10], [90, 28, 4, 16, 3], [14, 86, 4, 18, 12]],
  auth: [[10, 20, 5, 14, 0], [24, 74, 4, 16, 3], [40, 12, 3, 13, 6], [58, 86, 5, 17, 2], [72, 22, 4, 15, 8], [88, 62, 5, 14, 5], [94, 14, 3, 16, 10]],
};
const GLOWS = { hero: ['a', 'b'], page: ['c', 'd', 'e'], auth: [] };
const SHAPES = { hero: ['ring-1', 'square-1'], page: ['ring-2'], auth: [] };

/** <AmbientBackground variant="hero" />   (dark hero)   |   "page" (light page wrapper)   |   "auth" (particles only)
    Place it as the first child of a position:relative container. */
export default function AmbientBackground({ variant = 'page' }) {
  return (
    <div className={`ambient ambient--${variant}`} aria-hidden="true">
      {GLOWS[variant].map((g) => <span key={g} className={`ambient__glow ambient__glow--${g}`} />)}
      {SHAPES[variant].map((s) => <span key={s} className={`ambient__shape ambient__shape--${s}`} />)}
      {PARTICLES[variant].map(([x, y, size, dur, delay], i) => (
        <span key={i} className="ambient__dot"
          style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, animationDuration: `${dur}s`, animationDelay: `${-delay}s` }} />
      ))}
    </div>
  );
}
