import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import '../styles/cinematic.css';

/* Cinematic layer (no dependencies): letterbox intro, warp-speed starfield, scroll-driven hero,
   film grain, vignette, light flare, marquee band, glowing cursor. Off for prefers-reduced-motion. */
const WORDS = ['Alumni', 'Events', 'Careers', 'Mentorship', 'Community', 'Stories', 'Reunions', 'Network'];
const mk = (tag, cls, html = '') => { const d = document.createElement(tag); d.className = cls; d.setAttribute('aria-hidden', 'true'); d.innerHTML = html; return d; };

function starfield(hero) {
  const cv = mk('canvas', 'c-stars'); hero.prepend(cv);
  const ctx = cv.getContext('2d'); let w = 0, h = 0, raf = 0, vis = true, boost = 0, lastY = scrollY;
  const stars = Array.from({ length: 170 }, () => ({ x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() }));
  const size = () => { const r = hero.getBoundingClientRect(); w = cv.width = r.width; h = cv.height = r.height; };
  size(); const ro = new ResizeObserver(size); ro.observe(hero);
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; }, { threshold: 0 }); io.observe(hero);
  const frame = () => {
    raf = requestAnimationFrame(frame); if (!vis) return;
    boost += ((Math.abs(scrollY - lastY) * 0.02) - boost) * 0.12; lastY = scrollY;
    const sp = 0.0016 + boost * 0.012;
    ctx.clearRect(0, 0, w, h);
    for (const s of stars) {
      const pz = s.z; s.z -= sp; if (s.z <= 0.02) { s.x = Math.random() * 2 - 1; s.y = Math.random() * 2 - 1; s.z = 1; continue; }
      const k = 0.55 * w, x = w / 2 + (s.x / s.z) * k * 0.5, y = h / 2 + (s.y / s.z) * k * 0.5, px = w / 2 + (s.x / pz) * k * 0.5, py = h / 2 + (s.y / pz) * k * 0.5;
      const a = Math.min(1, (1 - s.z) * 1.4);
      ctx.strokeStyle = `rgba(190,210,255,${a})`; ctx.lineWidth = 0.6 + (1 - s.z) * 1.6;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(x, y); ctx.stroke();
    }
  };
  frame();
  return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); cv.remove(); };
}

export default function Cinematic() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    let off = () => {};
    const t = setTimeout(() => {
      const hero = document.querySelector('.hero');
      if (!hero || hero.dataset.cine) return;
      hero.dataset.cine = '1';
      const stop = starfield(hero);
      hero.append(mk('div', 'c-vig'), mk('div', 'c-flare'));
      const text = [...WORDS, ...WORDS].map((w) => `<span>${w}</span><b>✦</b>`).join('');
      const band = mk('div', 'c-marquee', `<div class="c-marquee__track">${text}${text}</div>`);
      hero.after(band);
      const onScroll = () => hero.style.setProperty('--sp', Math.min(1, scrollY / (hero.offsetHeight || 700)).toFixed(3));
      addEventListener('scroll', onScroll, { passive: true }); onScroll();
      off = () => { stop(); removeEventListener('scroll', onScroll); band.remove(); };
    }, 90);
    return () => { clearTimeout(t); off(); };
  }, [pathname]);

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const grain = mk('div', 'c-grain'); document.body.appendChild(grain);
    let bars = null;
    if (document.querySelector('.m-intro')) {
      bars = mk('div', 'c-bars', '<i></i><i></i>'); document.body.appendChild(bars);
      setTimeout(() => bars.classList.add('is-open'), 1700); setTimeout(() => bars.remove(), 3000);
    }
    let cur = null, raf = 0, cx = -100, cy = -100, tx = -100, ty = -100;
    if (matchMedia('(pointer: fine)').matches) {
      cur = mk('div', 'c-cursor', '<i></i>'); document.body.appendChild(cur);
      const loop = () => { cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18; cur.style.transform = `translate(${cx}px, ${cy}px)`; raf = requestAnimationFrame(loop); };
      loop();
    }
    const move = (e) => { tx = e.clientX; ty = e.clientY; if (cur) cur.classList.toggle('is-hot', !!(e.target.closest && e.target.closest('a, button, .card, input, select, textarea'))); };
    addEventListener('pointermove', move, { passive: true });
    return () => { grain.remove(); if (bars) bars.remove(); if (cur) cur.remove(); cancelAnimationFrame(raf); removeEventListener('pointermove', move); };
  }, []);

  return null;
}
