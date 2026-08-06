import { Menu, Bell, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onMenuClick }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/70 px-4 backdrop-blur-lg sm:px-6 lg:px-8">
      <button className="text-text-muted lg:hidden" onClick={onMenuClick} aria-label="Open menu">
        <Menu size={22} />
      </button>

      <div className="hidden lg:block">
        <p className="text-sm text-text-muted">
          Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''} 👋
        </p>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative text-text-muted transition-colors hover:text-text" aria-label="Notifications">
          <Bell size={20} />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-accent" />
        </button>

        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-accent font-display text-sm font-semibold text-white">
            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 text-sm text-text-muted transition-colors hover:text-error"
        >
          <LogOut size={16} />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}
