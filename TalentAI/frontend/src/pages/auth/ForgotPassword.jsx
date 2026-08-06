import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Sparkles, Loader2, MailCheck } from 'lucide-react';
import { authService } from '../../services/authService';

export default function ForgotPassword() {
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (formData) => {
    setSubmitting(true);
    try {
      await authService.forgotPassword(formData);
      setSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-16">
      <div className="glass-card w-full max-w-md p-8 text-center">
        <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-accent">
          <Sparkles size={22} className="text-white" />
        </span>

        {sent ? (
          <>
            <MailCheck size={40} className="mx-auto mb-4 text-success" />
            <h1 className="text-2xl font-bold">Check your email</h1>
            <p className="mt-2 text-sm text-text-muted">
              If an account exists for that email, a reset link is on its way.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold">Reset your password</h1>
            <p className="mt-1 text-sm text-text-muted">
              Enter your email and we'll send you a reset link.
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-4 text-left">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-text-muted">Email</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="you@example.com"
                  {...register('email', { required: 'Email is required' })}
                />
                {errors.email && <p className="mt-1 text-xs text-error">{errors.email.message}</p>}
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full">
                {submitting ? <Loader2 size={18} className="animate-spin" /> : 'Send reset link'}
              </button>
            </form>
          </>
        )}

        <p className="mt-6 text-center text-sm text-text-muted">
          Remembered it?{' '}
          <Link to="/login" className="font-medium text-accent hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}
