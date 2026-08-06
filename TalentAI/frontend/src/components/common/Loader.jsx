import { Loader2 } from 'lucide-react';
import clsx from 'clsx';

export default function Loader({ size = 24, fullScreen = false, label }) {
  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3 text-text-muted">
      <Loader2 size={size} className="animate-spin text-accent" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className={clsx('fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm')}>
        {spinner}
      </div>
    );
  }

  return spinner;
}
