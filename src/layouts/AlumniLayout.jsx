import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { loadProfile, PROFILE_EVENT } from '../utils/profile';

const SECTIONS = [
  { heading: 'MAIN MENU', links: [
    { to: '/member', label: 'Dashboard', icon: 'home', end: true },
    { to: '/member/profile', label: 'My profile', icon: 'user' },
  ] },
  { heading: 'CONTRIBUTE', links: [
    { to: '/member/articles', label: 'My articles', icon: 'book' },
  ] },
  { heading: 'EXPLORE', links: [
    { to: '/member/opportunities', label: 'Opportunities', icon: 'briefcase' },
    { to: '/member/events', label: 'Events', icon: 'calendar' },
  ] },
];

export default function AlumniLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(() => loadProfile({}).photo);
  useEffect(() => { // keep the sidebar picture in step with the profile page
    const sync = () => setPhoto(loadProfile({}).photo);
    window.addEventListener(PROFILE_EVENT, sync);
    return () => window.removeEventListener(PROFILE_EVENT, sync);
  }, []);
  return (
    <Sidebar title="Alumni" sections={SECTIONS} user={{ name: user?.name || 'Alumni member', role: 'alumni', photo }}
      profileTo="/member/profile" onLogout={() => { logout(); navigate('/'); }}>
      <Outlet />
    </Sidebar>
  );
}
