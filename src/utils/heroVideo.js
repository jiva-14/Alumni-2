import { useEffect, useState } from 'react';

/* Hero video config.
   Published config  : /hero-config.json  (committed to the site; every visitor gets it)
   Admin local draft  : localStorage       (only this browser; used for preview until published) */
export const KEY = 'portal-hero-video';
export const DEFAULTS = { enabled: false, url: '', poster: '', overlay: 45 };

export function youtubeId(url = '') {
  const m = String(url).match(/(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}
/** Returns an error message, or '' when the URL is acceptable. */
export function validateSource(url) {
  const u = String(url || '').trim();
  if (!u) return '';
  if (youtubeId(u)) return '';
  if (/^(https:\/\/|\/)[^\s]+\.(mp4|webm|ogg|mov)(\?[^\s]*)?$/i.test(u)) return '';
  return 'Use a YouTube link, or a direct https:// (or /videos/...) link ending in .mp4, .webm or .ogg.';
}
export function validateImage(url) {
  const u = String(url || '').trim();
  return !u || /^(https:\/\/|\/)[^\s]+$/i.test(u) ? '' : 'Poster must be an https:// link or a /path.';
}
const clean = (c) => ({
  enabled: !!c?.enabled,
  url: typeof c?.url === 'string' ? c.url.trim() : '',
  poster: typeof c?.poster === 'string' ? c.poster.trim() : '',
  overlay: Math.min(85, Math.max(0, Number(c?.overlay) || 0)),
});
export const readLocal = () => { try { const r = localStorage.getItem(KEY); return r ? clean(JSON.parse(r)) : null; } catch { return null; } };
export const saveLocal = (c) => { try { localStorage.setItem(KEY, JSON.stringify(clean(c))); window.dispatchEvent(new Event('hero-video-changed')); return true; } catch { return false; } };
export const clearLocal = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } window.dispatchEvent(new Event('hero-video-changed')); };

async function tryJson(url) {
  try {
    const r = await fetch(url, { cache: 'no-cache' });
    if (!r.ok || !(r.headers.get('content-type') || '').includes('json')) return null;
    const j = await r.json();
    return j && typeof j === 'object' && !Array.isArray(j) && 'enabled' in j ? clean(j) : null;
  } catch { return null; }
}
/* 1) live setting saved from the admin panel (Netlify Function)  2) /hero-config.json committed to the site */
async function fetchPublished() { return (await tryJson('/api/hero-config')) || (await tryJson('/hero-config.json')) || DEFAULTS; }

/** Publish for every visitor. Returns { ok, message }. */
export async function publishLive(config, adminKey) {
  try {
    const r = await fetch('/api/hero-config', { method: 'POST', headers: { 'content-type': 'application/json', 'x-admin-key': adminKey }, body: JSON.stringify(clean(config)) });
    if (r.ok) return { ok: true, message: 'Published. Visitors see the change within about a minute.' };
    if (r.status === 401) return { ok: false, message: 'Wrong admin key.' };
    if (r.status === 400) return { ok: false, message: (await r.text()) || 'Invalid settings.' };
    if (r.status === 503) return { ok: false, message: 'The ADMIN_KEY is not set in Netlify yet (see the setup steps).' };
    const t = (await r.text().catch(() => '')).replace(/<[^>]*>/g, ' ').trim().slice(0, 140);
    return { ok: false, message: `Server replied ${r.status}${t ? `: ${t}` : ''}${r.status === 404 || r.status === 405 ? ' (the publish function is not deployed on this site)' : ''}` };
  } catch { return { ok: false, message: 'Could not reach the server. Publishing only works on the deployed Netlify site.' }; }
}

/** { config, published, hasLocal } — local draft wins so the admin sees changes instantly. */
export function useHeroVideo() {
  const [published, setPublished] = useState(DEFAULTS);
  const [local, setLocal] = useState(readLocal);
  useEffect(() => {
    let alive = true;
    fetchPublished().then((c) => { if (alive) setPublished(c); });
    const sync = () => setLocal(readLocal());
    window.addEventListener('hero-video-changed', sync); window.addEventListener('storage', sync);
    return () => { alive = false; window.removeEventListener('hero-video-changed', sync); window.removeEventListener('storage', sync); };
  }, []);
  return { config: local || published, published, hasLocal: !!local };
}
