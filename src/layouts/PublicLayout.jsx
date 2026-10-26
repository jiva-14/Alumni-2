import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function PublicLayout() {
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const dashboardPath = user?.role === 'admin' ? '/admin' : '/member';
  return (
    <>
      <Navbar user={user} dashboardPath={dashboardPath} onLogout={logout} />
      <main id="main" key={pathname} className="page-enter"><Outlet /></main>
      <Footer />
    </>
  );
}
