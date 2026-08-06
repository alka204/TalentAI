import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Mic, Trophy, Clock, TrendingUp, TrendingDown, ArrowRight } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import Skeleton from '../../components/common/Skeleton';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { formatMinutes, formatDate, formatScore, formatSignedNumber } from '../../utils/formatters';

export default function Overview() {
  const [stats, setStats] = useState(null);
  const [recentInterviews, setRecentInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    dashboardService
      .getOverview()
      .then((data) => {
        if (cancelled) return;
        setStats(data.stats);
        setRecentInterviews(data.recentInterviews);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load your dashboard stats');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const improvementTrend =
    stats?.improvement == null ? null : stats.improvement >= 0 ? 'up' : 'down';

  return (
    <div>
      <PageHeader
        title="Overview"
        subtitle="Your interview prep at a glance"
        action={
          <Link to="/dashboard/interview/setup" className="btn-primary">
            <Mic size={18} />
            New Interview
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
        ) : (
          <>
            <StatCard label="Interviews Completed" value={stats?.interviewsCompleted ?? 0} icon={Mic} />
            <StatCard label="Average Score" value={formatScore(stats?.averageScore)} icon={Trophy} />
            <StatCard
              label="Practice Time"
              value={formatMinutes(stats?.practiceTimeMinutes ?? 0)}
              icon={Clock}
            />
            <StatCard
              label="Improvement"
              value={formatSignedNumber(stats?.improvement)}
              icon={improvementTrend === 'down' ? TrendingDown : TrendingUp}
              trend={
                stats?.improvement != null
                  ? improvementTrend === 'up'
                    ? 'Trending up vs. earlier sessions'
                    : 'Dipped vs. earlier sessions'
                  : undefined
              }
            />
          </>
        )}
      </div>

      <div className="mt-8 glass-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recent Interviews</h2>
          {recentInterviews.length > 0 && (
            <Link to="/dashboard/history" className="flex items-center gap-1 text-sm text-accent hover:underline">
              View all
              <ArrowRight size={14} />
            </Link>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        ) : recentInterviews.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
            <p className="text-text-muted">You haven't taken an interview yet.</p>
            <Link to="/dashboard/interview/setup" className="btn-secondary">
              Start your first mock interview
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {recentInterviews.map((interview) => (
              <div key={interview.id} className="flex items-center justify-between py-3">
                <div>
                  <p className="font-medium">{interview.role}</p>
                  <p className="text-xs text-text-muted">
                    {interview.difficulty} · {interview.duration} min · {formatDate(interview.completedAt)}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-accent">{formatScore(interview.overallScore)}</span>
                  <Link
                    to={`/dashboard/interview/result?interview=${interview.interviewId}`}
                    className="text-sm text-text-muted hover:text-text"
                  >
                    View report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
