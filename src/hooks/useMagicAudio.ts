'use client';

import { useCallback, useRef } from 'react';

export type SoundType = 'correct' | 'wrong' | 'gameOver';

export function useMagicAudio() {
  const audioCtxRef = useRef<AudioContext | null>(null);

  const playMagicSound = useCallback((type: SoundType, volume: number) => {
    if (volume <= 0) return;

    if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    const audioCtx = audioCtxRef.current;
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    if (type === 'correct') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(1400, audioCtx.currentTime + 0.1);
      gainNode.gain.setValueAtTime(volume * 0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } else if (type === 'wrong') {
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(220, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(110, audioCtx.currentTime + 0.2);
      gainNode.gain.setValueAtTime(volume * 0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.5);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.5);
    } else if (type === 'gameOver') {
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(440, audioCtx.currentTime);
      oscillator.frequency.linearRampToValueAtTime(220, audioCtx.currentTime + 0.5);
      gainNode.gain.setValueAtTime(volume * 0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 1);
      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 1);
    }
  }, []);

  return { playMagicSound };
}
