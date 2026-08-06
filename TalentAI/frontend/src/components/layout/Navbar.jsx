import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/70 backdrop-blur-lg">
      <nav className="section-container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
            <Sparkles size={18} className="text-white" />
          </span>
          TalentAI
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm text-text-muted transition-colors hover:text-text"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <NavLink to="/dashboard" className="btn-primary">
              Go to Dashboard
            </NavLink>
          ) : (
            <>
              <NavLink to="/login" className="btn-secondary">
                Log in
              </NavLink>
              <NavLink to="/signup" className="btn-primary">
                Get Started
              </NavLink>
            </>
          )}
        </div>

        <button
          className="text-text md:hidden"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-border md:hidden">
          <div className="section-container flex flex-col gap-4 py-4">
            {links.map((link) => (
              <a key={link.label} href={link.href} className="text-sm text-text-muted">
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-3 pt-2">
              <NavLink to="/login" className="btn-secondary w-full">
                Log in
              </NavLink>
              <NavLink to="/signup" className="btn-primary w-full">
                Get Started
              </NavLink>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
