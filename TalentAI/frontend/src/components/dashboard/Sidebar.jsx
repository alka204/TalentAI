import { NavLink } from 'react-router-dom';
import clsx from 'clsx';
import {
  LayoutDashboard,
  FileText,
  Mic,
  History,
  UserCircle,
  Sparkles,
  X,
} from 'lucide-react';

const navItems = [
  { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
  { label: 'Resume', to: '/dashboard/resume', icon: FileText },
  { label: 'New Interview', to: '/dashboard/interview/setup', icon: Mic },
  { label: 'History', to: '/dashboard/history', icon: History },
  { label: 'Profile', to: '/dashboard/profile', icon: UserCircle },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-secondary/80 backdrop-blur-lg transition-transform duration-300 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between px-6">
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
              <Sparkles size={18} className="text-white" />
            </span>
            TalentAI
          </div>
          <button className="text-text-muted lg:hidden" onClick={onClose} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map(({ label, to, icon: Icon, end }) => (
            <NavLink
              key={label}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-gradient-accent text-white shadow-glow-sm'
                    : 'text-text-muted hover:bg-card hover:text-text'
                )
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="glass-card p-4 text-center">
            <p className="text-xs text-text-muted">Powered by</p>
            <p className="text-sm font-semibold gradient-text">Gemini AI</p>
          </div>
        </div>
      </aside>
    </>
  );
}
