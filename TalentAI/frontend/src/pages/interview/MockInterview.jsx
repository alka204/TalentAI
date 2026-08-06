import Webcam from "react-webcam";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  Video,
  Mic,
  MicOff,
  Play,
  Pause,
  SkipForward,
  Square,
  Loader2,
} from "lucide-react";
import Skeleton from "../../components/common/Skeleton";
import LiveEvaluation from "../../components/interview/LiveEvaluation";
import { interviewService } from "../../services/interviewService";
import { useSpeechRecognition } from "../../hooks/useSpeechRecognition";
import { formatSeconds } from "../../utils/formatters";

const MIN_QUESTION_SECONDS = 60;

export default function MockInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [transcripts, setTranscripts] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [finishing, setFinishing] = useState(false);

  const questionIndexRef = useRef(0);
  useEffect(() => {
    questionIndexRef.current = questionIndex;
  }, [questionIndex]);

  // Fetch the generated interview
  useEffect(() => {
    let cancelled = false;

    interviewService
      .get(id)
      .then((data) => {
        if (cancelled) return;
        setInterview(data.interview);
        setTranscripts(data.interview.questions.map((q) => q.transcript || ""));
      })
      .catch((err) => {
        if (!cancelled) {
          toast.error(
            err.response?.data?.message || "Could not load this interview",
          );
          navigate("/dashboard/interview/setup");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, navigate]);

  const totalQuestions = interview?.questions?.length ?? 0;
  const isLastQuestion = questionIndex >= totalQuestions - 1;

  const perQuestionSeconds = useMemo(() => {
    if (!interview) return MIN_QUESTION_SECONDS;
    return Math.max(
      MIN_QUESTION_SECONDS,
      Math.round((interview.duration * 60) / (totalQuestions || 1)),
    );
  }, [interview, totalQuestions]);

  // Reset the per-question timer whenever we move to a new question
  useEffect(() => {
    setTimeRemaining(perQuestionSeconds);
    setIsRecording(false);
  }, [questionIndex, perQuestionSeconds]);

  // Countdown while actively recording
  useEffect(() => {
    if (!isRecording) return undefined;
    const interval = setInterval(() => {
      setTimeRemaining((t) => Math.max(t - 1, 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRecording]);

  const handleSpeechResult = (finalText) => {
    setTranscripts((prev) => {
      const updated = [...prev];
      const idx = questionIndexRef.current;
      updated[idx] = `${updated[idx] || ""}${finalText}`;
      return updated;
    });
  };

  const {
    isSupported: speechSupported,
    start: startSpeech,
    stop: stopSpeech,
  } = useSpeechRecognition(handleSpeechResult);

  const currentTranscript = transcripts[questionIndex] || "";

  const submitCurrentAnswer = async () => {
    try {
      await interviewService.submitAnswer(id, {
        questionIndex,
        answer: currentTranscript,
        transcript: currentTranscript,
      });
    } catch {
      toast.error("Could not save that answer — moving on anyway");
    }
  };

  const handleStart = () => {
    if (speechSupported) startSpeech();
    setIsRecording(true);
  };

  const handlePause = () => {
    if (speechSupported) stopSpeech();
    setIsRecording(false);
  };

  // Auto-advance (or finish) when the per-question timer runs out
  useEffect(() => {
    if (isRecording && timeRemaining === 0) {
      if (isLastQuestion) {
        handleFinish();
      } else {
        handleNext();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining]);

  const handleNext = async () => {
    if (isRecording && speechSupported) stopSpeech();
    setIsRecording(false);
    setSubmitting(true);
    await submitCurrentAnswer();
    setSubmitting(false);
    setQuestionIndex((i) => Math.min(i + 1, totalQuestions - 1));
  };

  const handleFinish = async () => {
    if (isRecording && speechSupported) stopSpeech();
    setIsRecording(false);
    setFinishing(true);

    await submitCurrentAnswer();

    try {
      await interviewService.finish(id);
      toast.success("Interview submitted — scoring your answers now");
    } catch {
      toast.error(
        "Could not score the interview automatically, but your answers were saved",
      );
    }

    navigate(`/dashboard/interview/result?interview=${id}`);
  };

  // Live, heuristic-only signals from the current transcript — the real scored
  // report is generated by Gemini in handleFinish above.
  const liveMetrics = useMemo(() => {
    const words = currentTranscript.trim()
      ? currentTranscript.trim().split(/\s+/)
      : [];
    const wordCount = words.length;
    const elapsedSeconds = Math.max(perQuestionSeconds - timeRemaining, 1);
    const wpm = Math.round((wordCount / elapsedSeconds) * 60);

    const fillerMatches =
      currentTranscript.match(
        /\b(um|uh|like|you know|so|actually|basically)\b/gi,
      ) || [];
    const fillerRatio = wordCount ? fillerMatches.length / wordCount : 0;

    const confidence = Math.max(
      0,
      Math.min(100, Math.round(100 - fillerRatio * 250)),
    );
    const fluency = Math.max(
      0,
      Math.min(100, Math.round(100 - Math.abs(wpm - 140) * 0.6)),
    );
    const pace = Math.max(
      0,
      Math.min(100, Math.round(100 - Math.abs(wpm - 140) * 0.5)),
    );

    return { wpm, confidence, fluency, pace };
  }, [currentTranscript, perQuestionSeconds, timeRemaining]);

  if (loading) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <Skeleton className="h-96 w-full" />
        <div className="flex flex-col gap-6">
          <Skeleton className="aspect-video w-full" />
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-40 w-full" />
        </div>
      </div>
    );
  }

  const currentQuestion = interview?.questions?.[questionIndex];

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      {/* Left: question + progress + controls */}
      <div className="glass-card flex flex-col p-6">
        <div className="mb-6 flex items-center justify-between">
          <span className="text-sm text-text-muted">
            {interview?.role} · Question {questionIndex + 1} of {totalQuestions}
          </span>
          <span className="font-mono text-sm text-accent">
            {formatSeconds(timeRemaining)}
          </span>
        </div>

        <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-accent transition-all duration-300"
            style={{
              width: totalQuestions
                ? `${((questionIndex + 1) / totalQuestions) * 100}%`
                : "0%",
            }}
          />
        </div>

        <div className="flex flex-1 items-center justify-center py-16">
          <p className="max-w-lg text-center text-xl font-medium leading-relaxed">
            {currentQuestion?.question ||
              "No question generated for this interview."}
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          {isRecording ? (
            <button className="btn-secondary" onClick={handlePause}>
              <Pause size={16} /> Pause
            </button>
          ) : (
            <button
              className="btn-secondary"
              onClick={handleStart}
              disabled={finishing}
            >
              <Play size={16} /> {currentTranscript ? "Resume" : "Start"}
            </button>
          )}

          <button
            className="btn-secondary"
            disabled={isLastQuestion || submitting || finishing}
            onClick={handleNext}
          >
            {submitting ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <SkipForward size={16} />
            )}
            Next
          </button>

          <button
            className="btn-primary"
            onClick={handleFinish}
            disabled={finishing}
          >
            {finishing ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <Square size={16} />
            )}
            Finish
          </button>
        </div>
      </div>

      {/* Right: webcam + transcript + live evaluation */}
      <div className="flex flex-col gap-6">
        <div className="glass-card overflow-hidden aspect-video">
          <Webcam
            audio={false}
            mirrored
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover rounded-xl"
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user",
            }}
          />
        </div>

        <div className="glass-card flex items-center justify-between p-4">
          <div className="flex items-center gap-2 text-sm text-text-muted">
            {isRecording ? (
              <>
                <Mic size={16} className="text-success" />
                Listening...
              </>
            ) : (
              <>
                <MicOff size={16} className="text-text-dim" />
                Mic paused
              </>
            )}
          </div>
          {!speechSupported && (
            <span className="text-xs text-warning">
              Speech capture unsupported — type your answer
            </span>
          )}
        </div>

        <div className="glass-card flex-1 p-4">
          <h3 className="mb-2 text-sm font-semibold text-text-muted">
            Transcript
          </h3>
          {speechSupported ? (
            <p className="min-h-[4rem] text-sm leading-relaxed text-text">
              {currentTranscript || (
                <span className="text-text-dim">
                  Your answer will appear here as you speak...
                </span>
              )}
            </p>
          ) : (
            <textarea
              className="input-field min-h-[6rem] resize-none"
              placeholder="Type your answer..."
              value={currentTranscript}
              onChange={(e) => {
                const value = e.target.value;
                setTranscripts((prev) => {
                  const updated = [...prev];
                  updated[questionIndex] = value;
                  return updated;
                });
              }}
            />
          )}
        </div>

        <LiveEvaluation metrics={liveMetrics} isRecording={isRecording} />
      </div>
    </div>
  );
}
