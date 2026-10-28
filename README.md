# Alumni Management Portal — UI

A complete, responsive front-end for an alumni portal: public site, alumni area and admin area.
**UI only — there is no backend.** Data comes from `src/data/mockData.js` (fictional sample data) and
changes made in forms/tables live in memory and reset on refresh.

## Run in VS Code
Requires Node.js 18+.
```bash
npm install
npm run dev        # opens at http://localhost:5173
npm run build      # production build into dist/
npm run preview    # serve the built site
```

## Preview the dashboards
Go to **/login**, choose *Alumni* or *Administrator*, enter any valid-looking email and a password of 6+ characters.
- Alumni area: `/member`   - Admin area: `/admin`

## Admin panel
Sign in as *Administrator*. The sidebar is grouped into MAIN, PEOPLE, ENGAGEMENT, MANAGEMENT and SYSTEM, collapses to an
icon rail (with tooltips; the choice is remembered), and becomes a drawer on mobile. All 19 admin routes open a working
screen backed by sample data in `src/data/adminData.js`. Screens that would need a server to take effect (password change,
two-factor, portal settings) are labelled as preview-only on the page.

## Structure
- `src/pages`, `src/pages/alumni`, `src/pages/admin` – all screens
- `src/components` – Navbar, collapsible `Sidebar` (sections, animated indicator, tooltips), Footer, PageHeader, AlumniCard, EventCard, BlogCard, SearchBar, Sidebar, `ui.jsx` (icons, empty/error/loading states, table, modal, badges), `ManageTable.jsx` (reusable admin CRUD screen)
- `src/layouts` – PublicLayout, AlumniLayout, AdminLayout
- `src/styles` – design tokens, page styles, `theme.css` (premium palette, hover effects, charts, login, dark mode); `responsive.css` loads last
- `src/context/AuthContext.jsx` – **placeholder** auth for previewing role-based areas

## Connecting a real backend later
Replace imports from `src/data/mockData.js` with API calls, replace `login()` in `AuthContext.jsx`, and call your API in the `save`/`delete` handlers of `ManageTable.jsx` and the form pages. No environment variables are needed for the UI itself.

## Premium UI upgrade (this version)
- **Palette & tokens** – Midnight Navy, Indigo, Violet, Teal, Sky, Coral, Amber (CSS variables in `global.css` / `theme.css`).
- **Dark mode** – toggle in the admin top bar; remembered in localStorage; follows the OS setting by default.
- **Charts** – `src/components/charts.jsx` (no new dependency): gradient `AreaChart`, multicolor `BarChart`, `DonutChart` with hover/keyboard tooltips.
- **Login** – animated gradient + floating shapes, Alumni/Administrator role cards, password toggle, inline validation.
- **Admin** – breadcrumbs, page-jump search, notifications and profile dropdowns, toasts, shared `ConfirmDialog`, pagination and status filter in `ManageTable`.
- **Accessibility** – focus rings, keyboard-reachable chart elements, `prefers-reduced-motion` support.

### What is real and what is sample data
- Dashboard "Alumni growth" and "Alumni distribution" are computed from `mockData.js`. "Event capacity" shows each event's capacity, **not** registrations (those need a backend).
- Portal visits / sign-ups on the Analytics page are **sample values** and are labelled "Sample".
- Login, password change, 2FA, settings and all saved changes are **preview only**: no server, no real authentication, data resets on refresh.

## Latest tweaks
- **Join the network** button: `.btn--join` (purple-blue gradient, white text, white outline, hover shimmer). Also fixed the white `.btn--light` button turning white-on-white in dark mode, and the "Browse alumni" button (`.btn--on-dark`) becoming unreadable on hover.
- **Ambient background**: `components/AmbientBackground.jsx` + `styles/ambient.css` (soft navy/indigo/violet/sky glows, a few light particles, thin geometric shapes; used on the home page and login; hidden/reduced on small screens, off with reduced motion). The earlier leaf decoration was removed.
- **Login eyes**: `components/PasswordEyes.jsx`, logic in `utils/eyeState.js`. Eyes close while the password field (or its show/hide button) is focused and the password is hidden; they reopen on blur, and stay open (glancing down) while the password is shown.

## MPGI branding and upgrade (latest)
- **Official logo**: `src/assets/mpgi-logo-original.png` is the supplied image, untouched. `src/assets/mpgi-logo.png` is a 488 px circular cut-out of it (transparent corners, text intact), used by `components/BrandLogo.jsx` in the navbar, footer, sidebar (alumni and admin), and login. Favicon and touch icon are in `public/`. The source image is only 550 px wide, so keep the logo at or below ~240 CSS px; a larger original (SVG or 1000 px+) would be sharper if you have one.
- **Design tokens**: `src/styles/brand.css` (loaded after `theme.css`) re-points the existing variables at the institutional palette: navy `#14264A`, blue `#294B91`, gold `#FFC928` accent, purple `#6554C0` secondary. Dark mode uses the existing `data-theme` system.
- **Admin tables** (`ManageTable.jsx`, used by 11 screens): sortable columns, input-type validation (email, number range, date, URL, length), unique stable IDs, discard-changes prompt, delete confirmation, Clear filters, and `localStorage` persistence with "Reset to sample data". Browser storage is a demo only: not shared, not secure, not a database.
- **Modal**: focus trap, focus restored on close, page scroll locked, labelled by its title.
- **Alumni directory**: department, year and location filters, sort, filter chips, Clear all, and Load more; all controls compose.
- **Profile**: completion is computed from 8 fields; edits are saved to browser storage (demo).

## Known limitations (frontend-only)
No backend: login is a preview, saved data is per-browser, no email or server writes occur. Not yet done: admin pages other than the shared table were not redesigned individually, gallery lightbox, event registration flow, automated tests, Lighthouse run.
