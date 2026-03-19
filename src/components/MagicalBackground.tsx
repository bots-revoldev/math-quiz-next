'use client';

import React from 'react';
import styles from './MagicalBackground.module.css';

export const MagicalBackground: React.FC = () => {
  return (
    <div className={styles.magicalBackground}>
      <div className={`${styles.star} ${styles.s1}`}>⭐</div>
      <div className={`${styles.star} ${styles.s2}`}>✨</div>
      <div className={`${styles.star} ${styles.s3}`}>⭐</div>
      <div className={`${styles.cloud} ${styles.c1}`}>☁️</div>
      <div className={`${styles.cloud} ${styles.c2}`}>☁️</div>
    </div>
  );
};
