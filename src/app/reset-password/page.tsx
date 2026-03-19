'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { resetPassword } from '@/lib/actions/auth';
import { Lock, Sparkles, CheckCircle2 } from 'lucide-react';
import styles from '../components/AuthForms.module.css';

function ResetPasswordContent() {
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Missing magic reset token!');
      return;
    }

    const res = await resetPassword(token, password);
    if (res.success) {
      setStatus('success');
      setTimeout(() => router.push('/'), 3000);
    } else {
      setError(res.error || 'The reset spell failed.');
      setStatus('error');
    }
  };

  if (status === 'success') {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <CheckCircle2 className={styles.sparkle} size={48} color="var(--correct)" />
          <h2 className={styles.title}>Secrets Recovered!</h2>
          <p className={styles.message}>Your magic password has been updated. Redirecting to login... ✨</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.magicIcon}>
          <Lock size={48} className={styles.sparkle} />
        </div>
        <h2 className={styles.title}>Choose New Secrets</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Lock className={styles.inputIcon} size={20} />
            <input
              type="password"
              placeholder="Your New Secret Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && <p className={styles.error}>{error}</p>}
          <button type="submit" className={styles.submitBtn}>
            <Sparkles size={20} />
            Reset My Magic Password
          </button>
        </form>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading magic...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
