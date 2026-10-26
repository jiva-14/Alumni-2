import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';

const SECTIONS = [
  { heading: 'MAIN MENU', links: [
    { to: '/member', label: 'Dashboard', icon: 'home', end: true },
    { to: '/member/profile', label: 'My profile', icon: 'user' },
  ] },
  { heading: 'CONTRIBUTE', links: [
    { to: '/member/articles', label: 'My articles', icon: 'book' },
    { to: '/member/opportunities', label: 'Opportunities', icon: 'briefcase' },
  ] },
];

export default function AlumniLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Sidebar title="Alumni" sections={SECTIONS} user={{ name: user?.name || 'Alumni member', role: 'alumni' }}
      profileTo="/member/profile" onLogout={() => { logout(); navigate('/'); }}>
      <Outlet />
    </Sidebar>
  );
}
