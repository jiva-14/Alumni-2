import { alumni } from '../data/mockData';
/** The sample alumni record that stands in for the signed-in member until a backend provides real accounts. */
export const ME_ID = alumni[0].id;

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
/* Photo is optional and is deliberately not counted in the completion percentage. */
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

/* ---- Profile photo ----
   The portal has no image hosting yet, so an uploaded photo is cropped to a square, shrunk to 256px and kept as a
   small data URL inside the saved profile (browser storage). When a backend exists, upload the file and store its URL
   in the same `photo` field; every screen reads it through photoFor() so nothing else has to change. */
export const PROFILE_EVENT = 'portal:profile-updated';
export const PHOTO_MAX_BYTES = 5 * 1024 * 1024;

export function readPhoto(file, side = 256) {
  return new Promise((resolve, reject) => {
    if (!file || !/^image\/(png|jpe?g|webp|gif)$/i.test(file.type)) { reject(new Error('Choose a PNG, JPG, WebP or GIF image.')); return; }
    if (file.size > PHOTO_MAX_BYTES) { reject(new Error('That image is larger than 5 MB.')); return; }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.naturalWidth, img.naturalHeight);
      const cv = document.createElement('canvas');
      cv.width = cv.height = Math.min(side, s);
      cv.getContext('2d').drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, cv.width, cv.height);
      URL.revokeObjectURL(url);
      resolve(cv.toDataURL('image/jpeg', 0.88));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('That file could not be read as an image.')); };
    img.src = url;
  });
}

/** Photo for a person record: their own photo field, or (for the signed-in sample member) the photo they uploaded. */
export function photoFor(person, myId = ME_ID) {
  if (!person) return undefined;
  const own = person.photo || person.image || person.avatar;
  if (own) return own;
  if (myId != null && person.id === myId) return loadProfile({}).photo || undefined;
  return undefined;
}
