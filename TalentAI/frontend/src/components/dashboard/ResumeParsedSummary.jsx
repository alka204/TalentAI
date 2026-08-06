import { GraduationCap, Briefcase, FolderGit2, Cpu } from 'lucide-react';

function TagList({ items }) {
  if (!items?.length) {
    return <p className="text-sm text-text-dim">Nothing detected here yet.</p>;
  }
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function LineList({ items }) {
  if (!items?.length) {
    return <p className="text-sm text-text-dim">Nothing detected here yet.</p>;
  }
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="text-sm leading-relaxed text-text-muted">
          {item}
        </li>
      ))}
    </ul>
  );
}

export default function ResumeParsedSummary({ parsed }) {
  if (!parsed) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Cpu size={16} className="text-accent" />
          Skills & Technologies
        </div>
        <TagList items={parsed.skills} />
      </div>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <GraduationCap size={16} className="text-accent" />
          Education
        </div>
        <LineList items={parsed.education} />
      </div>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <Briefcase size={16} className="text-accent" />
          Experience
        </div>
        <LineList items={parsed.experience} />
      </div>

      <div className="glass-card p-5">
        <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-text-muted">
          <FolderGit2 size={16} className="text-accent" />
          Projects
        </div>
        <LineList items={parsed.projects} />
      </div>
    </div>
  );
}
