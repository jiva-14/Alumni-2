/** Profile completion is derived from the fields below; nothing is a fixed percentage. */
export const PROFILE_FIELDS = [
  { name: 'name', label: 'Full name' },
  { name: 'email', label: 'Email address' },
  { name: 'graduationYear', label: 'Graduation year' },
  { name: 'department', label: 'Department' },
  { name: 'currentRole', label: 'Current role' },
  { name: 'company', label: 'Company' },
  { name: 'location', label: 'Location' },
  { name: 'bio', label: 'About you' },
];
export const PROFILE_KEY = 'portal-demo:my-profile';

export function loadProfile(fallback) {
  try { const s = JSON.parse(localStorage.getItem(PROFILE_KEY)); if (s && typeof s === 'object') return { ...fallback, ...s }; } catch { /* use fallback */ }
  return fallback;
}
export function completion(profile) {
  const items = PROFILE_FIELDS.map((f) => ({ ...f, done: String(profile?.[f.name] ?? '').trim().length > 0 }));
  const done = items.filter((i) => i.done).length;
  return { items, done, total: items.length, percent: Math.round((done / items.length) * 100) };
}
