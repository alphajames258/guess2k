'use client';

// Rules.tsx
import React from 'react';
import styles from './Rules.module.css'

const Rules = () => {
  return (
    <div >
      <h2 className= {styles.title}>🏀 How to Play 🏀</h2>
      <p className = {styles.par}>
        Welcome to the NBA Player Guessing Game! In this game, you will be presented with the name of an NBA player rated 85 overall or higher. Your task is to guess the name of the player within 5 attempts.
      </p>
      <p className = {styles.par}>
        You can input your guesses letter by letter. If a letter you guessed is correct and in the correct position, it will appear in green. If the letter is correct but in the wrong position, it will appear in yellow. If the letter is incorrect, it will appear in red.
      </p>
      <p className = {styles.par}>
        Use the hints provided to guess the players position, height, jersey number, team, and overall rating.
      </p>
      <p className = {styles.par}>
        Good luck and have fun! 🏀
      </p>
    </div>
  );
};

export default Rules;

