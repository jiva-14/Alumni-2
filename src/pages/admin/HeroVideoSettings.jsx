import { useId, useRef, useState } from 'react';
import { Toggle } from '../../components/ui';
import { useToast } from '../../context/ToastContext';
import { HeroMedia } from '../../components/HeroVideo';
import { DEFAULTS, clearLocal, publishLive, saveLocal, useHeroVideo, validateImage, validateSource } from '../../utils/heroVideo';

export default function HeroVideoSettings() {
  const uid = useId();
  const toast = useToast();
  const { config: current, published, hasLocal } = useHeroVideo();
  const [form, setForm] = useState({ ...DEFAULTS, ...current });
  const [fileUrl, setFileUrl] = useState('');
  const fileRef = useRef(null);
  const [key, setKey] = useState(() => { try { return sessionStorage.getItem('portal-admin-key') || ''; } catch { return ''; } });
  const [busy, setBusy] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const urlErr = validateSource(form.url);
  const posterErr = validateImage(form.poster);
  const bad = !!(urlErr || posterErr) || (form.enabled && !form.url.trim());

  const save = () => {
    if (bad) { toast.error?.('Fix the highlighted fields first.'); return; }
    toast.success(saveLocal(form) ? 'Saved. The home hero now uses this video in this browser.' : 'Could not save (browser storage is blocked).');
  };
  const publish = async () => {
    if (bad) { toast.error?.('Fix the highlighted fields first.'); return; }
    if (!key.trim()) { toast.error?.('Enter the admin key first.'); return; }
    setBusy(true);
    const r = await publishLive(form, key.trim());
    setBusy(false);
    if (r.ok) { try { sessionStorage.setItem('portal-admin-key', key.trim()); } catch { /* ignore */ } clearLocal(); toast.success(r.message); } else toast.error(r.message);
  };
  const reset = () => { clearLocal(); setForm({ ...DEFAULTS, ...published }); toast.success('Local draft cleared. Showing the published setting.'); };
  const download = () => {
    const blob = new Blob([JSON.stringify({ enabled: form.enabled, url: form.url.trim(), poster: form.poster.trim(), overlay: Number(form.overlay) }, null, 2) + '\n'], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'hero-config.json'; a.click(); URL.revokeObjectURL(a.href);
  };
  const pickFile = (e) => {
    const f = e.target.files?.[0]; if (!f) return;
    if (!/^video\//.test(f.type)) { toast.error?.('Please choose a video file.'); return; }
    if (fileUrl) URL.revokeObjectURL(fileUrl);
    setFileUrl(URL.createObjectURL(f));
  };
  const preview = fileUrl ? { ...form, enabled: true, url: fileUrl } : form;

  return (
    <>
      <div className="dash-head"><div><h1>Hero video</h1><p>Control the background video on the home page hero.</p></div>
        <div style={{ display: 'flex', gap: '.5rem', flexWrap: 'wrap' }}>
          <button className="btn btn--outline" onClick={reset}>Reset</button>
          <button className="btn btn--primary" onClick={save} disabled={bad}>Save</button>
        </div></div>
      {hasLocal && <div className="alert alert--success" role="status" style={{ marginBottom: 'var(--space-4)' }}>A local draft is active in this browser. Visitors only see it after you publish (step 3 below).</div>}
      <div className="split">
        <section className="card panel">
          <div className="panel__head"><h2>Settings</h2></div>
          <div className="setting-row"><div><strong>Show hero video</strong><span>Turn the background video on or off.</span></div>
            <Toggle checked={form.enabled} onChange={set('enabled')} label="Show hero video" /></div>
          <div className="field"><label htmlFor={`${uid}u`}>Video link</label>
            <input id={`${uid}u`} autoComplete="off" name="hero-video-url" className="input" placeholder="https://youtu.be/…  or  /videos/hero.mp4" value={form.url} onChange={(e) => set('url')(e.target.value)} aria-invalid={!!urlErr} />
            {urlErr ? <div className="hv-err">{urlErr}</div> : <span className="hv-hint">YouTube link or a direct .mp4 / .webm. Plays muted and looping.</span>}
            {form.enabled && !form.url.trim() && <div className="hv-err">Add a video link to turn this on.</div>}</div>
          <div className="field"><label htmlFor={`${uid}p`}>Poster image (optional)</label>
            <input id={`${uid}p`} autoComplete="off" name="hero-poster-url" className="input" placeholder="/images/hero-poster.jpg" value={form.poster} onChange={(e) => set('poster')(e.target.value)} aria-invalid={!!posterErr} />
            {posterErr ? <div className="hv-err">{posterErr}</div> : <span className="hv-hint">Shown while the video loads and for visitors who turn motion off.</span>}</div>
          <div className="field"><label htmlFor={`${uid}o`}>Dark overlay: {form.overlay}%</label>
            <input id={`${uid}o`} type="range" min="0" max="85" className="hv-range" value={form.overlay} onChange={(e) => set('overlay')(Number(e.target.value))} />
            <span className="hv-hint">Higher keeps the headline easier to read.</span></div>
          <div className="field"><label htmlFor={`${uid}f`}>Try a file from your computer (preview only)</label>
            <input id={`${uid}f`} ref={fileRef} type="file" accept="video/*" className="input" onChange={pickFile} />
            <span className="hv-hint">Not saved. To use it on the site, follow step 2 below.</span></div>
        </section>
        <section className="card panel">
          <div className="panel__head"><h2>Preview</h2></div>
          <div className="hv-prev">
            <HeroMedia config={preview} allowBlob />
            <div className="hv-prev__text"><strong>{preview.enabled && preview.url ? 'Stay connected to the people and place that shaped you' : 'Video is off or empty'}</strong></div>
          </div>
          <div className="panel__head" style={{ marginTop: 'var(--space-5)' }}><h2>Publish live (everyone)</h2></div>
          <div className="field"><label htmlFor={`${uid}k`}>Admin key</label>
            <input id={`${uid}k`} type="password" autoComplete="new-password" name="hero-admin-key" className="input" placeholder="The ADMIN_KEY you set in Netlify" value={key} onChange={(e) => setKey(e.target.value)} />
            <span className="hv-hint">Use a YouTube link or a hosted video link. Takes effect for all visitors without redeploying.</span></div>
          <button className="btn btn--primary" onClick={publish} disabled={bad || busy}>{busy ? 'Publishing…' : 'Publish live'}</button>
          <div className="panel__head" style={{ marginTop: 'var(--space-5)' }}><h2>Or publish through GitHub</h2></div>
          <ol className="hv-steps">
            <li>Click <strong>Save</strong> to check it on the home page in this browser.</li>
            <li>For your own video file, put it in <code>public/videos/</code> (e.g. <code>hero.mp4</code>, keep it under ~10&nbsp;MB) and use <code>/videos/hero.mp4</code> as the link.</li>
            <li>Click <button type="button" className="btn btn--outline btn--sm" onClick={download} disabled={bad}>Download hero-config.json</button>, replace <code>public/hero-config.json</code> in the project, then commit and push. Netlify redeploys and everyone sees it.</li>
          </ol>
        </section>
      </div>
    </>
  );
}
