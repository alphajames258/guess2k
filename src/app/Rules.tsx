'use client';

// Rules.tsx
import React from 'react';
import styles from './Rules.module.css';

const Rules = () => {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>🏀 How to Play 🏀</h2>
      <p className={styles.par}>
        Welcome to the NBA Player Guessing Game! Get ready to test your
        knowledge of top NBA players. In this game, youll be challenged to guess
        the name of an NBA player rated 85 overall or higher. You have 5 attempts
        to guess the players name correctly.
      </p>
      <p className={styles.par}>
        Enter your guesses letter by letter. If you guess a letter correctly and
        its in the right spot, it will light up in green. If the letter is
        correct but in the wrong spot, it will appear in yellow. If the letter
        is incorrect, it will show up in red.
      </p>
      <p className={styles.par}>
        Use the hints provided to figure out the players identity. Focus on
        their position, height, and overall rating. If you guess incorrectly
        twice, youll get an extra clue: the players jersey number. If you
        struggle after three incorrect attempts, well reveal the players team
        name to help you out.
      </p>
      <p className={styles.par}>
        Every time you guess the players name correctly, a 🏀 will appear on the
        screen to celebrate your success! Guess correctly three times in a row
        to increase the challenge: the players will now be rated 75 overall or
        higher.
      </p>
      <p className={styles.par}>
        Think you have what it takes to guess all the players? 🏀 Good luck and have fun! 🏀
      </p>
    </div>
  );
};


export default Rules;
