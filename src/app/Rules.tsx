'use client';

// Rules.tsx
import React from 'react';
import styles from './Rules.module.css';

const Rules = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏀 How to Play 🏀</h2>
      <p className={styles.par}>
        Welcome to the NBA Player Guessing Game! In this game, you will be
        presented with the name of an NBA player rated 85 overall or higher.
        Your task is to guess the name of the player within 5 attempts.
      </p>
      <p className={styles.par}>
        You can input your guesses letter by letter. If a letter you guessed is
        correct and in the correct position, it will appear in green. If the
        letter is correct but in the wrong position, it will appear in yellow.
        If the letter is incorrect, it will appear in red.
      </p>
      <p className={styles.par}>
        Your challenge is to guess the identity of the NBA player based on the
        provided hints. Pay close attention to the players position, height, and
        overall rating. If you guess incorrectly more than twice, we will offer
        you an additional clue: the players jersey number. And if you find
        yourself struggling after three incorrect attempts, we will reveal the
        players team name to assist you further. Stay sharp, and lets see if you
        have what it takes to uncover the mystery behind each NBA player!
      </p>
      <p className={styles.par}>🏀 Good luck and have fun! 🏀</p>
      
    </div>
  );
};

export default Rules;
