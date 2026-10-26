import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { Icon } from './ui';
import '../styles/dashboard.css';

const DESKTOP = '(min-width: 861px)';
const STORE_KEY = 'portal-ui-sidebar-collapsed';
const isDesktop = () => typeof window !== 'undefined' && window.matchMedia(DESKTOP).matches;

const readCollapsed = () => {
  try { return localStorage.getItem(STORE_KEY) === '1'; } catch { return false; }
};

/**
 * Dashboard shell: collapsible sectioned sidebar + top bar.
 *
 *   <Sidebar title="Admin" sections={[{ heading, links: [{ to, label, icon, end, badge }] }]}
 *            user={{ name, role }} bellTo="/admin/notifications" bellCount={3} onLogout={fn}>
 *     <Outlet />
 *   </Sidebar>
 *
 * `links` (flat array) is still accepted and rendered as a single unlabeled section.
 * Desktop: collapses to an icon rail with tooltips. Mobile: slide-in drawer.
 */
export default function Sidebar({
  title = 'Dashboard', brand = 'Alumni Portal', sections, links = [], user, bellTo, bellCount = 0, notifications = [], profileTo, settingsTo, onLogout, children,
}) {
  const groups = useMemo(() => sections ?? [{ links }], [sections, links]);
  const flat = useMemo(() => groups.flatMap((g) => g.links), [groups]);

  const [open, setOpen] = useState(false);          // mobile drawer
  const [collapsed, setCollapsed] = useState(readCollapsed);
  const [tip, setTip] = useState(null);             // collapsed-mode tooltip
  const [ind, setInd] = useState({ top: 0, height: 0, ready: false, show: false });
  const { pathname } = useLocation();
  const navRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggle: toggleTheme } = useTheme();
  const [menu, setMenu] = useState(null);           // 'notif' | 'profile' | null
  const [q, setQ] = useState('');
  const topRef = useRef(null);

  useEffect(() => { setOpen(false); setTip(null); setMenu(null); setQ(''); }, [pathname]);
  useEffect(() => {
    if (!menu) return undefined;
    const onDoc = (e) => { if (!topRef.current?.contains(e.target)) setMenu(null); };
    const onKey = (e) => e.key === 'Escape' && setMenu(null);
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDoc); document.removeEventListener('keydown', onKey); };
  }, [menu]);
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    try { localStorage.setItem(STORE_KEY, collapsed ? '1' : '0'); } catch { /* storage unavailable */ }
  }, [collapsed]);

  // Slim indicator that glides to whichever link is active.
  const measure = useCallback(() => {
    const el = navRef.current?.querySelector('.sidebar__link.active');
    if (!el) { setInd((i) => ({ ...i, show: false })); return; }
    const h = 22;
    setInd((i) => ({ top: el.offsetTop + (el.offsetHeight - h) / 2, height: h, ready: i.ready, show: true }));
  }, []);
  useLayoutEffect(() => {
    measure();
    const id = requestAnimationFrame(() => setInd((i) => ({ ...i, ready: true })));
    return () => cancelAnimationFrame(id);
  }, [pathname, collapsed, groups, measure]);
  useEffect(() => {
    window.addEventListener('resize', measure);
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    if (ro && navRef.current) ro.observe(navRef.current);
    return () => { window.removeEventListener('resize', measure); ro?.disconnect(); };
  }, [measure]);

  const showTip = (label) => (e) => {
    if (!collapsed || !isDesktop()) return;
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ label, top: r.top + r.height / 2, left: r.right + 14 });
  };
  const hideTip = () => setTip(null);
  const tipProps = (label) => ({ onMouseEnter: showTip(label), onFocus: showTip(label), onMouseLeave: hideTip, onBlur: hideTip });

  const toggleMenu = () => { if (isDesktop()) { setCollapsed((c) => !c); setTip(null); } else setOpen(true); };

  const current = useMemo(() => {
    const hits = flat.filter((l) => (l.end ? pathname === l.to : pathname === l.to || pathname.startsWith(`${l.to}/`)));
    return hits.sort((a, b) => b.to.length - a.to.length)[0];
  }, [flat, pathname]);
  const results = useMemo(() => {
    const t = q.trim().toLowerCase();
    return t ? flat.filter((l) => l.label.toLowerCase().includes(t)).slice(0, 6) : [];
  }, [flat, q]);
  const goFirst = (e) => { e.preventDefault(); if (results[0]) navigate(results[0].to); };
  const initials = (user?.name || title).split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <div className="dash">
      <aside id="sidebar" className={`sidebar${open ? ' open' : ''}${collapsed ? ' collapsed' : ''}`} aria-label={`${title} navigation`}>
        <div className="sidebar__scroll">
          <Link to="/" className="sidebar__brand" aria-label={`${brand} home`}>
            <span className="sidebar__logo" aria-hidden="true">{brand.charAt(0)}</span>
            <span className="sidebar__brandtext"><strong>{brand}</strong><small>{title} console</small></span>
          </Link>

          <nav className="sidebar__navwrap" ref={navRef} aria-label={`${title} menu`}>
            <span className="sidebar__indicator" aria-hidden="true"
              style={{ transform: `translateY(${ind.top}px)`, height: ind.height, opacity: ind.show ? 1 : 0, transition: ind.ready ? undefined : 'none' }} />
            {groups.map((g, gi) => (
              <div className="sidebar__group" key={g.heading || gi}>
                {g.heading && <div className="sidebar__heading"><span>{g.heading}</span></div>}
                <ul className="sidebar__nav">
                  {g.links.map((l) => (
                    <li key={l.to}>
                      <NavLink to={l.to} end={l.end} className={({ isActive }) => `sidebar__link${isActive ? ' active' : ''}`} {...tipProps(l.label)}>
                        <span className="sidebar__icon"><Icon name={l.icon || 'home'} size={19} /></span>
                        <span className="sidebar__label">{l.label}</span>
                        {l.badge ? <span className="sidebar__badge">{l.badge}</span> : null}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          {onLogout && (
            <div className="sidebar__foot">
              {user && (
                <div className="sidebar__user">
                  <span className="sidebar__avatar" aria-hidden="true">{initials}</span>
                  <span className="sidebar__usertext"><strong>{user.name}</strong><small>{user.role}</small></span>
                </div>
              )}
              <button type="button" className="sidebar__link sidebar__logout" onClick={onLogout} {...tipProps('Log out')}>
                <span className="sidebar__icon"><Icon name="logout" size={19} /></span>
                <span className="sidebar__label">Log out</span>
              </button>
            </div>
          )}
        </div>

        <button type="button" className="sidebar__handle" onClick={() => { setCollapsed((c) => !c); setTip(null); }}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} aria-pressed={collapsed}>
          <Icon name={collapsed ? 'chevronR' : 'chevronL'} size={14} />
        </button>
      </aside>

      {tip && <div className="sidebar__tip" role="tooltip" style={{ top: tip.top, left: tip.left }}>{tip.label}</div>}
      <div className={`dash__scrim${open ? ' open' : ''}`} onClick={() => setOpen(false)} />

      <div className="dash__main">
        <header className="dash__topbar" ref={topRef}>
          <div className="dash__topleft">
            <button className="icon-btn" onClick={toggleMenu} aria-label="Toggle navigation" aria-expanded={open || !collapsed} aria-controls="sidebar" data-tip="Menu">
              <Icon name="panel" size={20} />
            </button>
            <nav className="crumbs-bar" aria-label="Breadcrumb">
              <ol>
                <li><Link to={flat[0]?.to || '/'}>{title}</Link></li>
                {current && current.to !== flat[0]?.to && <li aria-current="page"><strong>{current.label}</strong></li>}
                {(!current || current.to === flat[0]?.to) && <li aria-current="page"><strong>{flat[0]?.label || title}</strong></li>}
              </ol>
            </nav>
          </div>

          <form className="topsearch" role="search" onSubmit={goFirst}>
            <Icon name="search" size={17} />
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Jump to a page…`} aria-label="Search pages" autoComplete="off" />
            {q.trim() && (
              <ul className="topsearch__list" role="listbox" aria-label="Matching pages">
                {results.length ? results.map((r) => (
                  <li key={r.to}><Link to={r.to}><Icon name={r.icon || 'home'} size={16} />{r.label}</Link></li>
                )) : <li className="topsearch__none">No matching pages</li>}
              </ul>
            )}
          </form>

          <div className="dash__topright">
            <button className="icon-btn" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} data-tip={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
              <Icon name={theme === 'dark' ? 'sun' : 'moon'} size={19} />
            </button>
            {bellTo && (
              <div className="dd">
                <button className="icon-btn icon-btn--bell" onClick={() => setMenu(menu === 'notif' ? null : 'notif')} aria-haspopup="true" aria-expanded={menu === 'notif'}
                  aria-label={`Notifications${bellCount ? `, ${bellCount} unread` : ''}`} data-tip="Notifications">
                  <Icon name="bell" size={20} />
                  {bellCount > 0 && <span className="icon-btn__dot">{bellCount}</span>}
                </button>
                {menu === 'notif' && (
                  <div className="dd__panel dd__panel--wide" role="menu">
                    <div className="dd__head"><strong>Notifications</strong><Link to={bellTo}>View all</Link></div>
                    {notifications.length ? (
                      <ul className="dd__list">
                        {notifications.slice(0, 4).map((n) => (
                          <li key={n.id} className={n.read ? '' : 'unread'}><strong>{n.title}</strong><span>{n.detail}</span><small>{n.time}</small></li>
                        ))}
                      </ul>
                    ) : <p className="dd__empty">You are all caught up.</p>}
                  </div>
                )}
              </div>
            )}
            <div className="dd">
              <button className="topbar__avatar topbar__avatar--btn" onClick={() => setMenu(menu === 'profile' ? null : 'profile')} aria-haspopup="true" aria-expanded={menu === 'profile'} aria-label="Account menu">
                {initials}
              </button>
              {menu === 'profile' && (
                <div className="dd__panel" role="menu">
                  <div className="dd__who"><strong>{user?.name}</strong><small>{user?.role}</small></div>
                  {profileTo && <Link role="menuitem" to={profileTo} className="dd__item"><Icon name="user" size={16} />Profile</Link>}
                  {settingsTo && <Link role="menuitem" to={settingsTo} className="dd__item"><Icon name="settings" size={16} />Settings</Link>}
                  <Link role="menuitem" to="/" className="dd__item"><Icon name="externalLink" size={16} />View public site</Link>
                  {onLogout && <button role="menuitem" className="dd__item dd__item--danger" onClick={onLogout}><Icon name="logout" size={16} />Log out</button>}
                </div>
              )}
            </div>
          </div>
        </header>
        <main id="main" key={pathname} className="dash__content page-enter">{children}</main>
      </div>
    </div>
  );
}
