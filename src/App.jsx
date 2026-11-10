import { lazy, Suspense } from 'react';
import MotionEffects from './components/MotionEffects';
import Cinematic from './components/Cinematic';
import { Link, Navigate, Outlet, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PublicLayout from './layouts/PublicLayout';
import AlumniLayout from './layouts/AlumniLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import AlumniDirectory from './pages/AlumniDirectory';
import Login from './pages/Login';
import { CardSkeletons } from './components/ui';

const AlumniProfile = lazy(() => import('./pages/AlumniProfile'));
const Events = lazy(() => import('./pages/Events'));
const EventDetails = lazy(() => import('./pages/EventDetails'));
const Blog = lazy(() => import('./pages/Blog'));
const BlogDetails = lazy(() => import('./pages/BlogDetails'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Community = lazy(() => import('./pages/Community'));
const AlumniDashboard = lazy(() => import('./pages/alumni/Dashboard'));
const MyProfile = lazy(() => import('./pages/alumni/MyProfile'));
const MyArticles = lazy(() => import('./pages/alumni/MyArticles'));
const Opportunities = lazy(() => import('./pages/alumni/Opportunities'));
const MemberEvents = lazy(() => import('./pages/alumni/Events'));
const AdminDashboard = lazy(() => import('./pages/admin/Dashboard'));
const AlumniManagement = lazy(() => import('./pages/admin/AlumniManagement'));
const EventManagement = lazy(() => import('./pages/admin/EventManagement'));
const BlogManagement = lazy(() => import('./pages/admin/BlogManagement'));
const GalleryManagement = lazy(() => import('./pages/admin/GalleryManagement'));
const ContentApprovals = lazy(() => import('./pages/admin/ContentApprovals'));
const Analytics = lazy(() => import('./pages/admin/Analytics'));
const Notifications = lazy(() => import('./pages/admin/Notifications'));
const Students = lazy(() => import('./pages/admin/People').then((m) => ({ default: m.Students })));
const Faculty = lazy(() => import('./pages/admin/People').then((m) => ({ default: m.Faculty })));
const UserManagement = lazy(() => import('./pages/admin/People').then((m) => ({ default: m.UserManagement })));
const Jobs = lazy(() => import('./pages/admin/Engagement').then((m) => ({ default: m.Jobs })));
const Announcements = lazy(() => import('./pages/admin/Engagement').then((m) => ({ default: m.Announcements })));
const SuccessStories = lazy(() => import('./pages/admin/Engagement').then((m) => ({ default: m.SuccessStories })));
const Enquiries = lazy(() => import('./pages/admin/Enquiries'));
const Reports = lazy(() => import('./pages/admin/Reports'));
const ActivityLogs = lazy(() => import('./pages/admin/ActivityLogs'));
const HeroVideoSettings = lazy(() => import('./pages/admin/HeroVideoSettings'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const ProfileSecurity = lazy(() => import('./pages/admin/ProfileSecurity'));
const Help = lazy(() => import('./pages/admin/Help'));

/** Redirects to /login unless the user is signed in with an allowed role. */
function RequireRole({ role }) {
  const { user } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (role && user.role !== role) return <Navigate to={user.role === 'admin' ? '/admin' : '/member'} replace />;
  return <Outlet />;
}

function NotFound() {
  return (
    <div className="section"><div className="container">
      <h1>Page not found</h1>
      <p>The page you are looking for does not exist.</p>
      <Link className="btn btn--primary" to="/">Back to home</Link>
    </div></div>
  );
}

export default function App() {
  return (
    <>
    <MotionEffects />
    <Cinematic />
    <Suspense fallback={<div className="container section"><CardSkeletons count={3} /></div>}>
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="alumni" element={<AlumniDirectory />} />
          <Route path="alumni/:id" element={<AlumniProfile />} />
          <Route path="events" element={<Events />} />
          <Route path="events/:id" element={<EventDetails />} />
          <Route path="blog" element={<Blog />} />
          <Route path="blog/:id" element={<BlogDetails />} />
          <Route path="gallery" element={<Gallery />} />
          <Route path="community" element={<Community />} />
          <Route path="login" element={<Login />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<RequireRole role="alumni" />}>
          <Route path="/member" element={<AlumniLayout />}>
            <Route index element={<AlumniDashboard />} />
            <Route path="profile" element={<MyProfile />} />
            <Route path="articles" element={<MyArticles />} />
            <Route path="opportunities" element={<Opportunities />} />
            <Route path="events" element={<MemberEvents />} />
          </Route>
        </Route>

        <Route element={<RequireRole role="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="alumni" element={<AlumniManagement />} />
            <Route path="events" element={<EventManagement />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="gallery" element={<GalleryManagement />} />
            <Route path="approvals" element={<ContentApprovals />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="students" element={<Students />} />
            <Route path="faculty" element={<Faculty />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="jobs" element={<Jobs />} />
            <Route path="announcements" element={<Announcements />} />
            <Route path="stories" element={<SuccessStories />} />
            <Route path="enquiries" element={<Enquiries />} />
            <Route path="reports" element={<Reports />} />
            <Route path="activity" element={<ActivityLogs />} />
            <Route path="hero-video" element={<HeroVideoSettings />} />
            <Route path="settings" element={<Settings />} />
            <Route path="profile" element={<ProfileSecurity />} />
            <Route path="help" element={<Help />} />
            <Route path="*" element={<Navigate to="/admin" replace />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
    </>
  );
}
