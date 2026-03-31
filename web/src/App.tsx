import { useState } from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import WorkoutsPage from './pages/WorkoutsPage';
import ProfilePage from './pages/ProfilePage';
import GroupsPage from './pages/GroupsPage';
import GroupDetailPage from './pages/GroupDetailPage';
import CreateGroupPage from './pages/CreateGroupPage';
import UserProfilePage from './pages/UserProfilePage';
import NewCheckInPage from './pages/NewCheckInPage';
import GroupInfoPage from './pages/GroupInfoPage';
import PostDetailPage from './pages/PostDetailPage';
import './App.css';

function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  const navItems = [
    { to: '/dashboard', icon: '📊', label: 'Dashboard' },
    { to: '/workouts', icon: '🏋️', label: 'Treinos' },
    { to: '/groups', icon: '👥', label: 'Grupos' },
    { to: '/groups/create', icon: '➕', label: 'Criar Grupo' },
    { to: '/profile', icon: '👤', label: 'Perfil' },
  ];

  const handleNavClick = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {/* Mobile Header */}
      <div className="mobile-header">
        <button className="hamburger-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '✕' : '☰'}
        </button>
        <span className="logo-text">💪 StepForge</span>
      </div>

      {/* Sidebar Overlay (mobile) */}
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'open' : ''}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <span className="logo-emoji">💪</span>
          <h2>StepForge</h2>
        </div>
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleNavClick}
            >
              <span className="link-icon">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.name?.charAt(0) || '?'}
          </div>
          <div className="sidebar-user-info">
            <div className="name">{user?.name || 'Usuário'}</div>
            <div className="email">{user?.email || ''}</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content" key={location.pathname}>
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/workouts" element={<WorkoutsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/groups" element={<GroupsPage />} />
          <Route path="/groups/create" element={<CreateGroupPage />} />
          <Route path="/groups/:groupId" element={<GroupDetailPage />} />
          <Route path="/groups/:groupId/checkin" element={<NewCheckInPage />} />
          <Route path="/groups/:groupId/info" element={<GroupInfoPage />} />
          <Route path="/user/:userId" element={<UserProfilePage />} />
          <Route path="/post/:postId" element={<PostDetailPage />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </main>
    </div>
  );
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary, #0f0f23)', color: 'white' }}>
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <Routes>
      {!isAuthenticated ? (
        <>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </>
      ) : (
        <Route path="/*" element={<AppLayout />} />
      )}
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
