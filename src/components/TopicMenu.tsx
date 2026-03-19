'use client';

import React from 'react';
import { TopicCard } from './TopicCard';
import styles from './TopicMenu.module.css';

export type MathTopic = 'addition' | 'subtraction' | 'multiplication' | 'division' | 'mixed';

interface TopicMenuProps {
  onSelect: (topic: MathTopic) => void;
}

export const TopicMenu: React.FC<TopicMenuProps> = ({ onSelect }) => {
  return (
    <div className={styles.menuContainer}>
      <div className={styles.grid}>
        <TopicCard 
          type="addition" 
          title="Addition" 
          range="1 – 20" 
          icon="+" 
          onClick={() => onSelect('addition')} 
        />
        <TopicCard 
          type="subtraction" 
          title="Subtraction" 
          range="1 – 20" 
          icon="−" 
          onClick={() => onSelect('subtraction')} 
        />
        <TopicCard 
          type="multiplication" 
          title="Multiplication" 
          range="1 – 10" 
          icon="×" 
          onClick={() => onSelect('multiplication')} 
        />
        <TopicCard 
          type="division" 
          title="Division" 
          range="1 – 10" 
          icon="÷" 
          onClick={() => onSelect('division')} 
        />
      </div>
      
      <button className={styles.mixedBtn} onClick={() => onSelect('mixed')}>
        <span className={styles.rainbow}>🌈</span> All Topics Mixed!
      </button>
    </div>
  );
};
