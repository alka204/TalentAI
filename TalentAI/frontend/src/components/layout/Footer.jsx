import { Sparkles } from 'lucide-react';

const columns = [
  {
    title: 'Product',
    links: ['Features', 'Pricing', 'How It Works', 'FAQ'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Legal',
    links: ['Privacy Policy', 'Terms of Service'],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-secondary/40">
      <div className="section-container grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-accent">
              <Sparkles size={18} className="text-white" />
            </span>
            TalentAI
          </div>
          <p className="mt-3 max-w-xs text-sm text-text-muted">
            Practice real interviews with an AI that talks back, scores you, and tells you exactly what to fix.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="mb-4 text-sm font-semibold text-text">{col.title}</h4>
            <ul className="space-y-3">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="text-sm text-text-muted transition-colors hover:text-text">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border py-6">
        <p className="section-container text-center text-xs text-text-dim">
          © {new Date().getFullYear()} TalentAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
