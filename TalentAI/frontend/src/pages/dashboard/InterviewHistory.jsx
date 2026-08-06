import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Search, SlidersHorizontal, RefreshCw, Trash2, Loader2 } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import Skeleton from '../../components/common/Skeleton';
import { historyService } from '../../services/historyService';
import { interviewService } from '../../services/interviewService';
import { useDebounce } from '../../hooks/useDebounce';
import { formatDate, formatScore } from '../../utils/formatters';
import { DIFFICULTIES } from '../../utils/constants';

const SORT_OPTIONS = [
  { value: 'completedAt', label: 'Date' },
  { value: 'overallScore', label: 'Score' },
  { value: 'role', label: 'Role' },
  { value: 'duration', label: 'Duration' },
];

export default function InterviewHistory() {
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [difficulty, setDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('completedAt');
  const [order, setOrder] = useState('desc');
  const [retakingId, setRetakingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const debouncedSearch = useDebounce(search, 400);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    historyService
      .getHistory({ search: debouncedSearch, difficulty, sortBy, order })
      .then((data) => {
        if (!cancelled) setHistory(data.history);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load your interview history');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedSearch, difficulty, sortBy, order]);

  const hasActiveFilters = useMemo(() => difficulty !== 'All', [difficulty]);

  const handleRetake = async (entry) => {
    setRetakingId(entry._id);
    try {
      const data = await interviewService.create({
        role: entry.role,
        experienceLevel: entry.experienceLevel,
        duration: entry.duration,
        difficulty: entry.difficulty,
      });
      navigate(`/dashboard/interview/session/${data.interview._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not start a new interview');
    } finally {
      setRetakingId(null);
    }
  };

  const handleDelete = async (entry) => {
    if (!window.confirm(`Delete this ${entry.role} interview from your history? This can't be undone.`)) {
      return;
    }

    setDeletingId(entry._id);
    try {
      await historyService.deleteEntry(entry._id);
      setHistory((prev) => prev.filter((item) => item._id !== entry._id));
      toast.success('Deleted');
    } catch {
      toast.error('Could not delete this entry');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <PageHeader title="Interview History" subtitle="All your past mock interviews in one place" />

      <div className="glass-card p-4">
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim" />
            <input
              className="input-field pl-9"
              placeholder="Search by role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              className="input-field w-auto py-2 text-sm"
              value={`${sortBy}:${order}`}
              onChange={(e) => {
                const [field, dir] = e.target.value.split(':');
                setSortBy(field);
                setOrder(dir);
              }}
            >
              {SORT_OPTIONS.map((opt) => (
                <optgroup key={opt.value} label={opt.label}>
                  <option value={`${opt.value}:desc`}>{opt.label} (newest/highest first)</option>
                  <option value={`${opt.value}:asc`}>{opt.label} (oldest/lowest first)</option>
                </optgroup>
              ))}
            </select>

            <button
              className={`btn-secondary ${hasActiveFilters ? 'border-accent/50 text-accent' : ''}`}
              onClick={() => setShowFilters((v) => !v)}
            >
              <SlidersHorizontal size={16} />
              Filter
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="mb-4 flex flex-wrap items-center gap-2 rounded-xl border border-border bg-secondary/40 p-3">
            <span className="text-xs font-medium text-text-muted">Difficulty:</span>
            {['All', ...DIFFICULTIES].map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`rounded-lg border px-3 py-1 text-xs font-medium transition-colors ${
                  difficulty === d
                    ? 'border-accent bg-accent/10 text-accent'
                    : 'border-border text-text-muted hover:text-text'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-text-muted">
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium">Date</th>
                <th className="pb-3 font-medium">Duration</th>
                <th className="pb-3 font-medium">Score</th>
                <th className="pb-3 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={5} className="py-3">
                      <Skeleton className="h-10 w-full" />
                    </td>
                  </tr>
                ))
              ) : history.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-text-dim">
                    {debouncedSearch || hasActiveFilters
                      ? 'No interviews match your search or filters.'
                      : 'No interviews yet — your history will show up here.'}
                  </td>
                </tr>
              ) : (
                history.map((entry) => (
                  <tr key={entry._id}>
                    <td className="py-3">
                      <p className="font-medium">{entry.role}</p>
                      <p className="text-xs text-text-muted">
                        {entry.experienceLevel} · {entry.difficulty}
                      </p>
                    </td>
                    <td className="py-3 text-text-muted">{formatDate(entry.completedAt)}</td>
                    <td className="py-3 text-text-muted">{entry.duration} min</td>
                    <td className="py-3 font-semibold text-accent">{formatScore(entry.overallScore)}</td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <Link
                          to={`/dashboard/interview/result?interview=${entry.interview}`}
                          className="text-text-muted hover:text-text"
                        >
                          View
                        </Link>
                        <button
                          className="flex items-center gap-1 text-text-muted hover:text-accent disabled:opacity-50"
                          onClick={() => handleRetake(entry)}
                          disabled={retakingId === entry._id}
                        >
                          {retakingId === entry._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <RefreshCw size={14} />
                          )}
                          Retake
                        </button>
                        <button
                          className="flex items-center gap-1 text-text-muted hover:text-error disabled:opacity-50"
                          onClick={() => handleDelete(entry)}
                          disabled={deletingId === entry._id}
                        >
                          {deletingId === entry._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Trash2 size={14} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
