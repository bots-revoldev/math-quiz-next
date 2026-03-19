'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import confetti from 'canvas-confetti';
import { useMagicAudio } from '@/hooks/useMagicAudio';
import { MathTopic } from './TopicMenu';
import styles from './QuizGame.module.css';

export const QuizGame: React.FC<{ topic: MathTopic; volume: number; onBack: () => void }> = ({ topic, volume, onBack }) => {
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [operator, setOperator] = useState<'+' | '-'>('+');
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'correct' | 'wrong' | '' }>({ text: '', type: '' });
  const [isGameOver, setIsGameOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { playMagicSound } = useMagicAudio();

  const generateProblem = useCallback(() => {
    const availableOps: ('+' | '-' | '×' | '÷')[] = 
      topic === 'mixed' ? ['+', '-', '×', '÷'] : 
      topic === 'multiplication' ? ['×'] :
      topic === 'division' ? ['÷'] :
      topic === 'subtraction' ? ['-'] : ['+'];

    const op = availableOps[Math.floor(Math.random() * availableOps.length)];
    let n1 = 0, n2 = 0;

    if (op === '+') {
      n1 = Math.floor(Math.random() * 20) + 1;
      n2 = Math.floor(Math.random() * 20) + 1;
    } else if (op === '-') {
      n1 = Math.floor(Math.random() * 20) + 5;
      n2 = Math.floor(Math.random() * (n1 - 1)) + 1;
    } else if (op === '×') {
      n1 = Math.floor(Math.random() * 10) + 1;
      n2 = Math.floor(Math.random() * 10) + 1;
    } else if (op === '÷') {
      n2 = Math.floor(Math.random() * 9) + 2; // Divisor (2-10)
      const result = Math.floor(Math.random() * 9) + 1; // Result (1-10)
      n1 = n2 * result; // Dividend
    }
    
    setNum1(n1);
    setNum2(n2);
    setOperator(op as any);
    setAnswer('');
    setTimeout(() => inputRef.current?.focus(), 10);
  }, [topic]);

  const checkAnswer = () => {
    const userAnswer = parseInt(answer);
    if (isNaN(userAnswer)) return;

    let correctAnswer = 0;
    if (operator === '+') correctAnswer = num1 + num2;
    else if (operator === '-') correctAnswer = num1 - num2;
    else if (operator === '×') correctAnswer = num1 * num2;
    else if (operator === '÷') correctAnswer = num1 / num2;

    if (userAnswer === correctAnswer) {
      setScore(s => s + 1);
      setFeedback({ text: 'Magical! ✨', type: 'correct' });
      playMagicSound('correct', volume);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#9333ea', '#ec4899', '#facc15']
      });
      setTimeout(() => {
        setFeedback({ text: '', type: '' });
        generateProblem();
      }, 1500);
    } else {
      setLives(l => {
        const next = l - 1;
        if (next <= 0) {
          setIsGameOver(true);
          playMagicSound('gameOver', volume);
        } else {
          setFeedback({ text: 'Try another spell! 🪄', type: 'wrong' });
          playMagicSound('wrong', volume);
          setTimeout(() => {
            setFeedback({ text: '', type: '' });
            setAnswer('');
            inputRef.current?.focus();
          }, 1500);
        }
        return next;
      });
    }
  };

  const restartGame = () => {
    setScore(0);
    setLives(3);
    setIsGameOver(false);
    setFeedback({ text: '', type: '' });
    generateProblem();
  };

  return (
    <div className={styles.gameContainer}>
      <header className={styles.gameHeader}>
        <div className={styles.stats}>
          <div className={styles.lives}>
            {'❤️'.repeat(lives)}{'🖤'.repeat(3 - lives)}
          </div>
          <div className={styles.scoreContainer}>
            <span className={styles.label}>Magic Stars:</span>
            <span className={styles.score}>{score}</span>
          </div>
        </div>
        <h1 className={styles.title}>Math Adventure</h1>
        <button onClick={onBack} className={styles.backBtn}>Exit Journey</button>
      </header>

      <section className={styles.quizCard}>
        <div className={styles.questionBox}>
          <span>{num1}</span>
          <span>{operator}</span>
          <span>{num2}</span>
          <span>=</span>
        </div>

        <div className={styles.inputArea}>
          <input
            ref={inputRef}
            type="number"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && checkAnswer()}
            placeholder="?"
            autoComplete="off"
            disabled={feedback.type !== '' || isGameOver}
          />
        </div>

        <button 
          onClick={checkAnswer} 
          className={styles.magicBtn}
          disabled={feedback.type !== '' || isGameOver}
        >
          Cast Magic! ✨
        </button>
      </section>

      <section className={`${styles.feedbackArea} ${styles[feedback.type]}`}>
        {feedback.text}
      </section>

      {isGameOver && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Adventure Ended!</h2>
            <p>You collected <span className={styles.finalScore}>{score}</span> Magic Stars! 🌟</p>
            <button onClick={restartGame} className={styles.magicBtn}>Start New Adventure!</button>
          </div>
        </div>
      )}
    </div>
  );
};
