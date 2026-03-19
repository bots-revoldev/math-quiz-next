'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { verifyEmail } from '@/lib/actions/auth';
import { Sparkles, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import styles from '@/components/AuthForms.module.css';

function VerifyContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [error, setError] = useState('');
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  useEffect(() => {
    async function doVerify() {
      if (!token) {
        setStatus('error');
        setError('No magic token found in the winds! 🌪️');
        return;
      }

      const res = await verifyEmail(token);
      if (res.success) {
        setStatus('success');
        setTimeout(() => router.push('/'), 3000);
      } else {
        setStatus('error');
        setError(res.error || 'The verification spell failed.');
      }
    }
    doVerify();
  }, [token, router]);

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {status === 'loading' && (
          <>
            <Loader2 className={`${styles.sparkle} animate-spin`} size={48} />
            <h2 className={styles.title}>Verifying Your Essence...</h2>
          </>
        )}
        
        {status === 'success' && (
          <>
            <CheckCircle2 className={styles.sparkle} size={48} color="var(--correct)" />
            <h2 className={styles.title}>Welcome to the Academy!</h2>
            <p className={styles.message}>Your magic has been verified. Redirecting you to the adventure... ✨</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <XCircle className={styles.sparkle} size={48} color="var(--wrong)" />
            <h2 className={styles.title}>Magic Interrupted</h2>
            <p className={styles.error}>{error}</p>
            <button onClick={() => router.push('/')} className={styles.submitBtn} style={{ marginTop: '2rem' }}>
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div>Loading magic...</div>}>
      <VerifyContent />
    </Suspense>
  );
}
