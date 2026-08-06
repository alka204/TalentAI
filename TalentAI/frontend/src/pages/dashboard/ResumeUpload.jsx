import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { UploadCloud, FileText, RefreshCw, CheckCircle2 } from 'lucide-react';
import PageHeader from '../../components/dashboard/PageHeader';
import ResumeParsedSummary from '../../components/dashboard/ResumeParsedSummary';
import Skeleton from '../../components/common/Skeleton';
import { resumeService } from '../../services/resumeService';

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export default function ResumeUpload() {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [existingResume, setExistingResume] = useState(null);
  const [loadingExisting, setLoadingExisting] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;

    resumeService
      .getMine()
      .then((data) => {
        if (!cancelled) setExistingResume(data.resume);
      })
      .catch(() => {
        if (!cancelled) toast.error('Could not load your existing resume');
      })
      .finally(() => {
        if (!cancelled) setLoadingExisting(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const validateAndSetFile = (candidate) => {
    if (!candidate) return;
    if (candidate.type !== 'application/pdf') {
      toast.error('Please upload a PDF file');
      return;
    }
    if (candidate.size > MAX_SIZE_BYTES) {
      toast.error('File must be under 5MB');
      return;
    }
    setFile(candidate);
  };

  const handleDrag = useCallback((e, active) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(active);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndSetFile(e.dataTransfer.files?.[0]);
  }, []);

  const handleSelect = (e) => {
    validateAndSetFile(e.target.files?.[0]);
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setProgress(0);

    try {
      const data = await resumeService.upload(file, setProgress);
      setExistingResume(data.resume);
      setFile(null);
      toast.success('Resume parsed successfully');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not upload resume');
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <div>
      <PageHeader title="Resume" subtitle="Upload your resume so the AI can tailor your interview" />

      <div
        onDragOver={(e) => handleDrag(e, true)}
        onDragLeave={(e) => handleDrag(e, false)}
        onDrop={handleDrop}
        className={`glass-card flex flex-col items-center justify-center gap-4 border-2 border-dashed p-16 text-center transition-colors ${
          dragActive ? 'border-accent bg-accent/5' : 'border-border'
        }`}
      >
        {file ? (
          <>
            <FileText size={40} className="text-accent" />
            <p className="font-medium">{file.name}</p>
            <p className="text-sm text-text-muted">{(file.size / 1024).toFixed(0)} KB</p>
          </>
        ) : existingResume ? (
          <>
            <CheckCircle2 size={40} className="text-success" />
            <p className="font-medium">{existingResume.fileName}</p>
            <p className="text-sm text-text-muted">Uploaded — drop a new PDF to replace it</p>
          </>
        ) : (
          <>
            <UploadCloud size={40} className="text-text-dim" />
            <p className="font-medium">Drag & drop your resume here</p>
            <p className="text-sm text-text-muted">PDF only, up to 5MB</p>
          </>
        )}

        <label className="btn-secondary mt-2 cursor-pointer">
          Browse files
          <input type="file" accept="application/pdf" className="hidden" onChange={handleSelect} />
        </label>
      </div>

      {uploading && (
        <div className="mt-4">
          <div className="mb-1.5 flex justify-between text-xs text-text-muted">
            <span>Uploading & parsing...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-accent transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 flex justify-end">
        <button className="btn-primary" disabled={!file || uploading} onClick={handleUpload}>
          {uploading ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Parsing...
            </>
          ) : (
            'Upload & Parse Resume'
          )}
        </button>
      </div>

      <div className="mt-10">
        <h2 className="mb-4 text-lg font-semibold">Parsed Details</h2>

        {loadingExisting ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-32 w-full" />
            ))}
          </div>
        ) : existingResume ? (
          <ResumeParsedSummary parsed={existingResume.parsed} />
        ) : (
          <div className="glass-card flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="text-text-muted">Upload a resume to see your parsed skills, education, and experience here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
