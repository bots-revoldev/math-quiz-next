'use client';

import { useState, useEffect } from 'react';
import { MagicalBackground } from '@/components/MagicalBackground';
import { SettingsBar } from '@/components/SettingsBar';
import { QuizGame } from '@/components/QuizGame';
import { TopicMenu, MathTopic } from '@/components/TopicMenu';
import { AuthForms } from '@/components/AuthForms';
import { useAuth } from '@/context/AuthContext';

export default function Home() {
  const { user, isLoading } = useAuth();
  const [darkMode, setDarkMode] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [mounted, setMounted] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<MathTopic | null>(null);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.body.classList.add('dark-mode');
    }
    const savedVolume = localStorage.getItem('volume');
    if (savedVolume !== null) setVolume(parseFloat(savedVolume));
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleVolumeChange = (v: number) => {
    setVolume(v);
    localStorage.setItem('volume', v.toString());
  };

  if (!mounted || isLoading) return null;

  return (
    <main style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 0' }}>
      <MagicalBackground />
      <SettingsBar 
        darkMode={darkMode} 
        onToggleTheme={toggleTheme} 
        volume={volume} 
        onVolumeChange={handleVolumeChange} 
      />
      
      {!user ? (
        <AuthForms />
      ) : selectedTopic ? (
        <QuizGame 
          topic={selectedTopic} 
          volume={volume} 
          onBack={() => setSelectedTopic(null)} 
        />
      ) : (
        <TopicMenu onSelect={setSelectedTopic} />
      )}
    </main>
  );
}
