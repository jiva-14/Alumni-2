import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { approvals } from '../data/mockData';
import { notifications } from '../data/adminData';

const unread = notifications.filter((n) => !n.read).length;
const pending = approvals.filter((a) => a.status === 'Pending').length;

const SECTIONS = [
  { heading: 'MAIN', links: [
    { to: '/admin', label: 'Overview', icon: 'home', end: true },
    { to: '/admin/analytics', label: 'Analytics', icon: 'chart' },
    { to: '/admin/notifications', label: 'Notifications', icon: 'bell', badge: unread || null },
  ] },
  { heading: 'PEOPLE', links: [
    { to: '/admin/alumni', label: 'Alumni', icon: 'users' },
    { to: '/admin/students', label: 'Students', icon: 'student' },
    { to: '/admin/faculty', label: 'Faculty', icon: 'faculty' },
    { to: '/admin/users', label: 'User Management', icon: 'shield' },
  ] },
  { heading: 'ENGAGEMENT', links: [
    { to: '/admin/events', label: 'Events', icon: 'calendar' },
    { to: '/admin/jobs', label: 'Jobs & Internships', icon: 'briefcase' },
    { to: '/admin/announcements', label: 'Announcements', icon: 'megaphone' },
    { to: '/admin/blog', label: 'News & Blogs', icon: 'news' },
    { to: '/admin/stories', label: 'Success Stories', icon: 'star' },
    { to: '/admin/gallery', label: 'Gallery', icon: 'image' },
    { to: '/admin/hero-video', label: 'Hero Video', icon: 'sparkle' },
  ] },
  { heading: 'MANAGEMENT', links: [
    { to: '/admin/approvals', label: 'Content Approvals', icon: 'check', badge: pending || null },
    { to: '/admin/enquiries', label: 'Contact Enquiries', icon: 'mail' },
    { to: '/admin/reports', label: 'Reports & Exports', icon: 'download' },
    { to: '/admin/activity', label: 'Activity Logs', icon: 'activity' },
  ] },
  { heading: 'SYSTEM', links: [
    { to: '/admin/settings', label: 'Portal Settings', icon: 'settings' },
    { to: '/admin/profile', label: 'Profile & Security', icon: 'lock' },
    { to: '/admin/help', label: 'Help & Support', icon: 'help' },
  ] },
];

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <Sidebar title="Admin" sections={SECTIONS} user={{ name: user?.name || 'Administrator', role: 'admin' }}
      bellTo="/admin/notifications" bellCount={unread} notifications={notifications} profileTo="/admin/profile" settingsTo="/admin/settings" onLogout={() => { logout(); navigate('/'); }}>
      <Outlet />
    </Sidebar>
  );
}
