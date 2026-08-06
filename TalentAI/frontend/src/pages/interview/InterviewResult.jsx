import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Download, Loader2, FileWarning, Sparkles } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import Skeleton from '../../components/common/Skeleton';
import { interviewService } from '../../services/interviewService';
import { formatDate } from '../../utils/formatters';

const METRIC_LABELS = {
  confidence: 'Confidence',
  communication: 'Communication',
  grammar: 'Grammar',
  technicalKnowledge: 'Technical Knowledge',
  fluency: 'Fluency',
  keywordMatch: 'Keyword Match',
  voicePace: 'Voice Pace',
};

function ListCard({ title, items, tone = 'text-text-muted' }) {
  return (
    <div className="glass-card p-6">
      <h3 className={`mb-3 text-sm font-semibold ${tone}`}>{title}</h3>
      {items?.length ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="text-sm leading-relaxed text-text-muted">
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-text-dim">Nothing recorded here.</p>
      )}
    </div>
  );
}

export default function InterviewResult() {
  const [searchParams] = useSearchParams();
  const interviewId = searchParams.get('interview');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notReady, setNotReady] = useState(false);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (!interviewId) {
      setLoading(false);
      return;
    }

    let cancelled = false;

    interviewService
      .getResult(interviewId)
      .then((data) => {
        if (!cancelled) setResult(data.result);
      })
      .catch(() => {
        if (!cancelled) setNotReady(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [interviewId]);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const blob = await interviewService.downloadReport(interviewId);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `talentai-report-${interviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error('Could not download the report right now');
    } finally {
      setDownloading(false);
    }
  };

  if (!interviewId) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 py-20 text-center">
        <FileWarning size={32} className="text-text-dim" />
        <p className="text-text-muted">No interview selected.</p>
        <Link to="/dashboard/history" className="btn-secondary">
          Go to interview history
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader title="Interview Result" subtitle="Loading your report..." />
        <div className="grid gap-6 lg:grid-cols-3">
          <Skeleton className="h-64 w-full lg:col-span-1" />
          <Skeleton className="h-64 w-full lg:col-span-2" />
        </div>
      </div>
    );
  }

  if (notReady) {
    return (
      <div className="glass-card flex flex-col items-center justify-center gap-3 py-20 text-center">
        <Sparkles size={32} className="text-accent" />
        <p className="font-medium">This report isn't ready yet</p>
        <p className="max-w-sm text-sm text-text-muted">
          Gemini may still be scoring your answers, or this interview hasn't been finished. Give it a
          moment and check your history, or start a new interview.
        </p>
        <div className="mt-2 flex gap-3">
          <Link to="/dashboard/history" className="btn-secondary">
            View history
          </Link>
          <Link to="/dashboard/interview/setup" className="btn-primary">
            New interview
          </Link>
        </div>
      </div>
    );
  }

  const interview = result.interview;

  return (
    <div>
      <PageHeader
        title="Interview Result"
        subtitle={
          interview
            ? `${interview.role} · ${interview.difficulty} · ${interview.duration} min · ${formatDate(
                interview.completedAt
              )}`
            : undefined
        }
        action={
          <button className="btn-secondary" onClick={handleDownload} disabled={downloading}>
            {downloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
            Download Report
          </button>
        }
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="glass-card flex flex-col items-center justify-center p-8 lg:col-span-1">
          <div
            className="relative flex h-40 w-40 items-center justify-center rounded-full"
            style={{
              background: `conic-gradient(#3B82F6 ${result.overallScore * 3.6}deg, #1E293B 0deg)`,
            }}
          >
            <div className="absolute inset-2 flex items-center justify-center rounded-full bg-card">
              <span className="gradient-text text-4xl font-bold">{result.overallScore}%</span>
            </div>
          </div>
          <p className="mt-4 text-sm text-text-muted">Overall Score</p>
        </div>

        <div className="glass-card p-6 lg:col-span-2">
          <h3 className="mb-4 text-sm font-semibold text-text-muted">Metric Breakdown</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            {Object.entries(METRIC_LABELS).map(([key, label]) => {
              const value = result.metrics?.[key] ?? 0;
              return (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-text-muted">{label}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
                    <div
                      className="h-full rounded-full bg-gradient-accent transition-all duration-700"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <ListCard title="Strengths" items={result.strengths} tone="text-success" />
        <ListCard title="Areas to Improve" items={result.weaknesses} tone="text-error" />
        <ListCard title="Mistakes" items={result.mistakes} tone="text-error" />
        <ListCard title="Recommended Learning" items={result.recommendedLearning} tone="text-accent" />
      </div>

      <div className="mt-6 glass-card p-6">
        <h3 className="mb-4 text-sm font-semibold text-text-muted">Question-by-Question Analysis</h3>
        {result.questionAnalysis?.length ? (
          <div className="space-y-4">
            {result.questionAnalysis.map((qa, i) => (
              <div key={i} className="rounded-xl border border-border p-4">
                <div className="mb-2 flex items-start justify-between gap-4">
                  <p className="font-medium">
                    {i + 1}. {qa.question}
                  </p>
                  <span className="shrink-0 rounded-full bg-accent/10 px-2.5 py-1 text-xs font-semibold text-accent">
                    {qa.score}%
                  </span>
                </div>
                {qa.answer && <p className="mb-2 text-sm text-text-muted">"{qa.answer}"</p>}
                {qa.feedback && <p className="text-sm text-text-dim">{qa.feedback}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-dim">No question-level analysis available.</p>
        )}
      </div>
    </div>
  );
}
