export function formatSeconds(totalSeconds = 0) {
  const safe = Math.max(0, Math.round(totalSeconds));
  const minutes = Math.floor(safe / 60);
  const seconds = safe % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatMinutes(totalMinutes = 0) {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

export function formatDate(dateInput) {
  if (!dateInput) return '—';
  return new Date(dateInput).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatScore(score) {
  return typeof score === 'number' ? `${score}%` : '—';
}

export function formatSignedNumber(value) {
  if (typeof value !== 'number') return '—';
  if (value === 0) return '0';
  return value > 0 ? `+${value}` : `${value}`;
}
