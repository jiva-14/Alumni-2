import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/motion.css';
import logoUrl from '../assets/mpgi-logo.png';

/* Zero-dependency motion layer: scroll-reveal with stagger, count-up numbers, cursor glow on cards,
   scroll progress bar. Renders nothing visible itself. Disabled for prefers-reduced-motion. */
const TARGETS = '.section__head, .grid-3 > *, .card-grid > *, .stats > *, .stat-card, .cta-band, .hero__panel, .page-header';

function countUp(el) {
  const raw = el.textContent.trim();
  const m = raw.match(/^([^\d]*)([\d,]+)(.*)$/);
  if (!m) return;
  const end = parseInt(m[2].replace(/,/g, ''), 10);
  if (!end || end > 1e7) return;
  const t0 = performance.now(), dur = 1200;
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
    el.textContent = p < 1 ? m[1] + Math.round(end * e).toLocaleString() + m[3] : raw;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* typewriter: splits the hero headline into per-character spans that appear one by one */
function typeHeadline() {
  const h = document.querySelector('.hero h1');
  if (!h || h.dataset.typed || h.children.length || !h.textContent) return;
  h.dataset.typed = '1';
  const text = h.textContent;
  h.setAttribute('aria-label', text);
  let n = 0;
  const frag = document.createDocumentFragment();
  text.split(' ').forEach((w, wi, arr) => {
    const word = document.createElement('span');
    word.className = 'tw'; word.setAttribute('aria-hidden', 'true');
    [...w].forEach((ch) => {
      const c = document.createElement('span');
      c.className = 'tc'; c.textContent = ch; c.style.animationDelay = `${0.25 + n++ * 0.035}s`;
      word.appendChild(c);
    });
    frag.appendChild(word);
    if (wi < arr.length - 1) { frag.appendChild(document.createTextNode(' ')); n++; }
  });
  h.textContent = ''; h.appendChild(frag);
  h.classList.add('is-typing');
}

/* bold hero extras: gradient mesh, mouse spotlight, floating 3D shapes, intro screen */
function heroExtras() {
  const hero = document.querySelector('.hero');
  if (!hero || hero.dataset.fx) return undefined;
  hero.dataset.fx = '1';
  const mk = (cls, html = '') => { const d = document.createElement('div'); d.className = cls; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html; return d; };
  const mesh = mk('m-mesh'), spot = mk('m-spot');
  const cube = mk('m-cube', '<i></i><i></i><i></i><i></i><i></i><i></i>');
  hero.prepend(mesh); hero.append(spot, mk('m-ring m-ring--1'), mk('m-ring m-ring--2'), cube);
  const move = (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--sx', `${e.clientX - r.left}px`); hero.style.setProperty('--sy', `${e.clientY - r.top}px`);
    const px = (e.clientX / innerWidth - 0.5), py = (e.clientY / innerHeight - 0.5);
    hero.style.setProperty('--px', px.toFixed(3)); hero.style.setProperty('--py', py.toFixed(3));
  };
  hero.addEventListener('pointermove', move, { passive: true });
  return () => hero.removeEventListener('pointermove', move);
}

function intro() {
  try { if (sessionStorage.getItem('m-intro')) return; sessionStorage.setItem('m-intro', '1'); } catch { /* ignore */ }
  const o = document.createElement('div');
  o.className = 'm-intro';
  o.innerHTML = `<img class="m-intro__logo" src="${logoUrl}" width="96" height="96" alt="" draggable="false"><div class="m-intro__name">MPGI Alumni Portal</div><div class="m-intro__bar"><span></span></div>`;
  document.body.appendChild(o);
  setTimeout(() => o.classList.add('is-out'), 1500);
  setTimeout(() => o.remove(), 2200);
}

export default function MotionEffects() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        en.target.classList.add('is-in');
        en.target.querySelectorAll('.stat__value, .stat-card__value').forEach(countUp);
        if (en.target.matches('.stat__value, .stat-card__value')) countUp(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    let cleanup;
    const t = setTimeout(() => {
      typeHeadline();
      cleanup = heroExtras();
      document.querySelectorAll(TARGETS).forEach((el, i) => {
        if (el.classList.contains('reveal')) return;
        el.classList.add('reveal');
        if (el.matches('.card, .stat-card')) el.classList.add('tilt');
        el.style.setProperty('--d', `${(i % 6) * 70}ms`);
        io.observe(el);
      });
    }, 60);
    return () => { clearTimeout(t); io.disconnect(); if (cleanup) cleanup(); };
  }, [pathname]);

  useEffect(() => { if (!matchMedia('(prefers-reduced-motion: reduce)').matches) intro(); }, []);

  useEffect(() => {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress';
    document.body.appendChild(bar);
    const onScroll = () => {
      const h = document.documentElement;
      bar.style.transform = `scaleX(${h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)})`;
    };
    const onMove = (e) => {
      const c = e.target.closest && e.target.closest('.card, .hero__panel, .btn--join');
      if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 12}deg`);
      c.style.setProperty('--rx', `${(0.5 - (e.clientY - r.top) / r.height) * 10}deg`);
      c.style.setProperty('--mx', `${e.clientX - r.left}px`);
      c.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    document.addEventListener('pointermove', onMove, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); document.removeEventListener('pointermove', onMove); bar.remove(); };
  }, []);

  return null;
}
