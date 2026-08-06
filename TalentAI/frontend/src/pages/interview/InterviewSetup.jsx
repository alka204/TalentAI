import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';
import PageHeader from '../../components/dashboard/PageHeader';
import { interviewService } from '../../services/interviewService';
import { ROLES, EXPERIENCE_LEVELS, INTERVIEW_DURATIONS, DIFFICULTIES } from '../../utils/constants';

function OptionGrid({ options, selected, onSelect, disabled, renderLabel }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          disabled={disabled}
          onClick={() => onSelect(option)}
          className={clsx(
            'rounded-xl border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            selected === option
              ? 'border-accent bg-accent/10 text-accent'
              : 'border-border text-text-muted hover:border-border-light hover:text-text'
          )}
        >
          {renderLabel ? renderLabel(option) : option}
        </button>
      ))}
    </div>
  );
}

export default function InterviewSetup() {
  const navigate = useNavigate();
  const [role, setRole] = useState(ROLES[0]);
  const [experience, setExperience] = useState(EXPERIENCE_LEVELS[0]);
  const [duration, setDuration] = useState(INTERVIEW_DURATIONS[0]);
  const [difficulty, setDifficulty] = useState(DIFFICULTIES[0]);
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      const data = await interviewService.create({
        role,
        experienceLevel: experience,
        duration,
        difficulty,
      });
      toast.success('Your interview is ready');
      navigate(`/dashboard/interview/session/${data.interview._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not generate interview questions');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div>
      <PageHeader title="New Interview" subtitle="Tell us what you'd like to practice" />

      <div className="glass-card space-y-8 p-6">
        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-muted">Role</h3>
          <OptionGrid options={ROLES} selected={role} onSelect={setRole} disabled={generating} />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-muted">Experience Level</h3>
          <OptionGrid
            options={EXPERIENCE_LEVELS}
            selected={experience}
            onSelect={setExperience}
            disabled={generating}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-muted">Interview Duration</h3>
          <OptionGrid
            options={INTERVIEW_DURATIONS}
            selected={duration}
            onSelect={setDuration}
            disabled={generating}
            renderLabel={(d) => `${d} min`}
          />
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold text-text-muted">Difficulty</h3>
          <OptionGrid
            options={DIFFICULTIES}
            selected={difficulty}
            onSelect={setDifficulty}
            disabled={generating}
          />
        </div>
      </div>

      {generating && (
        <div className="glass-card mt-6 flex items-center gap-3 p-4 text-sm text-text-muted">
          <Sparkles size={18} className="animate-pulse text-accent" />
          Gemini is putting together questions for a {experience.toLowerCase()} {role} interview...
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button className="btn-primary px-8" onClick={handleGenerate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              Generating questions...
            </>
          ) : (
            'Generate Interview'
          )}
        </button>
      </div>
    </div>
  );
}
