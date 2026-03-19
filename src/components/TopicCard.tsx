'use client';

import React from 'react';
import styles from './TopicCard.module.css';

interface TopicCardProps {
  type: 'addition' | 'subtraction' | 'multiplication' | 'division';
  title: string;
  range: string;
  icon: string;
  onClick: () => void;
}

const colorMap = {
    addition: '#fdf2f8',
    subtraction: '#f5f3ff',
    multiplication: '#ecfdf5',
    division: '#fffbeb',
};

export const TopicCard: React.FC<TopicCardProps> = ({ type, title, range, icon, onClick }) => {
  return (
    <button 
      className={styles.card} 
      onClick={onClick}
      style={{ backgroundColor: colorMap[type] }}
    >
      <div className={styles.iconContainer}>
        <span className={styles.icon}>{icon}</span>
      </div>
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.range}>Numbers {range}</p>
    </button>
  );
};
