'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import styles from './AuthForms.module.css';
import { Sparkles, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

export function AuthForms() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.magicIcon}>
          <Sparkles size={48} className={styles.sparkle} />
        </div>
        
        <h2 className={styles.title}>
          {isLogin ? 'Welcome Back, Wizard!' : 'Join the Magic Academy'}
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
          
          {error && <p className={styles.error}>{error}</p>}
          
          <button type="submit" className={styles.submitBtn}>
            {isLogin ? <LogIn size={20} /> : <UserPlus size={20} />}
            <span>{isLogin ? 'Enter the Adventure' : 'Start My Journey'}</span>
          </button>
        </form>
        
        <button 
          className={styles.toggleBtn}
          onClick={() => {
            setIsLogin(!isLogin);
            setError('');
          }}
        >
          {isLogin ? "Don't have a wand yet? Sign up!" : "Already a wizard? Log in here!"}
        </button>
      </div>
    </div>
  );
}
