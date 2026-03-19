'use client';

import React from 'react';
import { Sun, Moon, Volume2, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import styles from './SettingsBar.module.css';

interface SettingsBarProps {
  darkMode: boolean;
  onToggleTheme: () => void;
  volume: number;
  onVolumeChange: (v: number) => void;
}

export const SettingsBar: React.FC<SettingsBarProps> = ({
  darkMode,
  onToggleTheme,
  volume,
  onVolumeChange,
}) => {
  const { user, logout } = useAuth();
  return (
    <div className={styles.settingsBar}>
      <button 
        onClick={onToggleTheme} 
        className={styles.iconBtn}
        title="Toggle Magical Night"
      >
        {darkMode ? <Moon size={24} /> : <Sun size={24} />}
      </button>
      <div className={styles.volumeControl}>
        <Volume2 size={24} />
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
          className={styles.volumeSlider}
        />
      </div>
      {user?.role === 'admin' && (
        <a 
          href="/admin" 
          className={styles.iconBtn}
          title="Enter the Magic Council"
        >
          <Shield size={24} />
        </a>
      )}
      {user && (
        <button 
          onClick={logout} 
          className={styles.iconBtn}
          title="Logout from the Academy"
        >
          <LogOut size={24} />
        </button>
      )}
    </div>
  );
};
