'use client'
import styles from './page.module.css';
import React from 'react';
interface DifficultyPopupProps {
    onClose: () => void;
  }
  

const DifficultyPopup: React.FC<DifficultyPopupProps> = ({ onClose }) => {
    return (
      <div className={styles.popup}>
        <div className={styles.popupContent}>
          <span className={styles.close} onClick={onClose}>&times;</span>
          <p className={styles.par}>🏀 Good job for getting 3 consecutive right, now the players will be from 75+ overall. 🏀</p>
        </div>
      </div>
    );
  };
  
  export default DifficultyPopup;
  