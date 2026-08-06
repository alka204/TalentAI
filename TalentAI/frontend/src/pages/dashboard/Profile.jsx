import { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { Camera, Loader2, Mic, Trophy } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import PageHeader from '../../components/dashboard/PageHeader';
import StatCard from '../../components/dashboard/StatCard';
import Skeleton from '../../components/common/Skeleton';
import { authService } from '../../services/authService';
import { dashboardService } from '../../services/dashboardService';
import { formatScore } from '../../utils/formatters';

const MAX_PHOTO_BYTES = 2 * 1024 * 1024;

export default function Profile() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef(null);

  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  const [stats, setStats] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    let cancelled = false;

    dashboardService
      .getOverview()
      .then((data) => {
        if (!cancelled) setStats(data.stats);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingStats(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const nameChanged = name.trim() && name.trim() !== user?.name;

  const handleSave = async () => {
    if (!nameChanged) return;
    setSaving(true);
    try {
      const data = await authService.updateProfile({ name: name.trim() });
      updateUser(data.user);
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update your profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-selecting the same file later
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Please upload a JPG, PNG, or WEBP image');
      return;
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast.error('Image must be under 2MB');
      return;
    }

    setUploadingPhoto(true);
    try {
      const data = await authService.uploadPhoto(file);
      updateUser(data.user);
      toast.success('Photo updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not upload your photo');
    } finally {
      setUploadingPhoto(false);
    }
  };

  return (
    <div>
      <PageHeader title="Profile" subtitle="Manage your account details" />

      <div className="glass-card max-w-2xl p-6">
        <div className="flex items-center gap-5">
          <div className="relative">
            {user?.photo ? (
              <img
                src={user.photo}
                alt={user.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-accent font-display text-2xl font-semibold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}

            {uploadingPhoto && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                <Loader2 size={20} className="animate-spin text-white" />
              </div>
            )}

            <button
              className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingPhoto}
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handlePhotoSelect}
            />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{user?.name || 'Your Name'}</h2>
            <p className="text-sm text-text-muted">{user?.email || 'you@example.com'}</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">Full name</label>
            <input className="input-field" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-text-muted">Email</label>
            <input className="input-field" defaultValue={user?.email} disabled />
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button className="btn-primary" onClick={handleSave} disabled={!nameChanged || saving}>
            {saving ? <Loader2 size={16} className="animate-spin" /> : null}
            Save Changes
          </button>
        </div>
      </div>

      <div className="mt-6 max-w-2xl">
        <h3 className="mb-3 text-sm font-semibold text-text-muted">Interview Stats</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          {loadingStats ? (
            <>
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </>
          ) : (
            <>
              <StatCard label="Interviews Completed" value={stats?.interviewsCompleted ?? 0} icon={Mic} />
              <StatCard label="Average Score" value={formatScore(stats?.averageScore)} icon={Trophy} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
