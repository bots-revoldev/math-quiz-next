'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthForms.module.css';
import { Sparkles, Mail, Lock, UserPlus, LogIn, ChevronLeft } from 'lucide-react';
import { requestPasswordReset } from '@/lib/actions/auth';

export function AuthForms() {
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    
    try {
      if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'signup') {
        const res = await register(email, password);
        setNeedsVerification(true);
        setMessage("A magical verification link has been sent to your console! ✨ Check it to confirm your essence.");
      } else if (mode === 'forgot') {
        await requestPasswordReset(email);
        setMessage("If a wizard with that email exists, a reset link has been sent to the console! 🪄");
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (needsVerification) {
    return (
      <div className={styles.authContainer}>
        <div className={styles.authCard}>
          <div className={styles.magicIcon}>
            <Mail size={48} className={styles.sparkle} />
          </div>
          <h2 className={styles.title}>Check Your Magic Mail!</h2>
          <p className={styles.message}>{message}</p>
          <button 
            onClick={() => {
              setNeedsVerification(false);
              setMode('login');
              setMessage('');
            }} 
            className={styles.submitBtn}
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        {mode === 'forgot' && (
          <button onClick={() => setMode('login')} className={styles.backLink}>
            <ChevronLeft size={16} /> Back to Login
          </button>
        )}
        
        <div className={styles.magicIcon}>
          <Sparkles size={48} className={styles.sparkle} />
        </div>
        
        <h2 className={styles.title}>
          {mode === 'login' ? 'Welcome Back, Wizard!' : 
           mode === 'signup' ? 'Join the Magic Academy' : 'Recover Your Secrets'}
        </h2>
        
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <Mail className={styles.inputIcon} size={20} />
            <input
              type="email"
              placeholder="Your Magic Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          {mode !== 'forgot' && (
            <div className={styles.inputGroup}>
              <Lock className={styles.inputIcon} size={20} />
              <input
                type="password"
                placeholder="Secret Magic Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          )}
          
          {error && <p className={styles.error}>{error}</p>}
          {message && <p className={styles.success}>{message}</p>}
          
          <button type="submit" className={styles.submitBtn}>
            {mode === 'login' ? <LogIn size={20} /> : 
             mode === 'signup' ? <UserPlus size={20} /> : <Sparkles size={20} />}
            <span>
              {mode === 'login' ? 'Enter the Adventure' : 
               mode === 'signup' ? 'Start My Journey' : 'Send Reset Link'}
            </span>
          </button>
        </form>
        
        <div className={styles.authFooter}>
          {mode === 'login' && (
            <>
              <button 
                className={styles.toggleBtn}
                onClick={() => setMode('signup')}
              >
                Don't have a wand yet? Sign up!
              </button>
              <button 
                className={styles.toggleBtn}
                onClick={() => setMode('forgot')}
              >
                Forgot your secrets?
              </button>
            </>
          )}
          
          {mode === 'signup' && (
            <button 
              className={styles.toggleBtn}
              onClick={() => setMode('login')}
            >
              Already a wizard? Log in!
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
