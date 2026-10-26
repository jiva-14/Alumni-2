import { getStore } from '@netlify/blobs';

/* GET  /api/hero-config  -> public, returns the live hero video setting
   POST /api/hero-config  -> requires header x-admin-key === env ADMIN_KEY */
const SRC = /^(https:\/\/|\/)[^\s]+\.(mp4|webm|ogg|mov)(\?[^\s]*)?$/i;
const YT = /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;
const IMG = /^(https:\/\/|\/)[^\s]+$/i;
const json = (body, status = 200, extra = {}) => new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json', ...extra } });

export default async (req) => {
  try { return await handle(req); } catch (e) { return json({ message: `Function error: ${String(e && e.message || e).slice(0, 200)}` }, 500); }
};

async function handle(req) {
  const store = getStore('hero');
  if (req.method === 'GET') {
    const data = await store.get('config', { type: 'json' }).catch(() => null);
    return data ? json(data, 200, { 'cache-control': 'public, max-age=30' }) : json({ message: 'not set' }, 404);
  }
  if (req.method !== 'POST') return json({ message: 'Method not allowed' }, 405);

  const adminKey = process.env.ADMIN_KEY;
  if (!adminKey) return json({ message: 'ADMIN_KEY not configured' }, 503);
  const given = req.headers.get('x-admin-key') || '';
  if (given.length !== adminKey.length || given !== adminKey) return json({ message: 'Unauthorized' }, 401);

  let b; try { b = await req.json(); } catch { return new Response('Invalid JSON', { status: 400 }); }
  const url = String(b.url || '').trim().slice(0, 500), poster = String(b.poster || '').trim().slice(0, 500);
  if (url && !YT.test(url) && !SRC.test(url)) return new Response('Video link must be YouTube or a direct .mp4/.webm link.', { status: 400 });
  if (poster && !IMG.test(poster)) return new Response('Poster must be an https:// link or a /path.', { status: 400 });
  const out = { enabled: !!b.enabled && !!url, url, poster, overlay: Math.min(85, Math.max(0, Number(b.overlay) || 0)) };
  await store.setJSON('config', out);
  return json({ ok: true });
}
