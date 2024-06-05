'use client';

/* eslint-disable */

import Image from 'next/image';
import styles from './page.module.css';
import playerData from '../../server/data2.json';
import { getRandomPlayers, getRandomItem } from '@/utils/getRandomPlayer';
import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import RenderResult from 'next/dist/server/render-result';
import Rules from './Rules';
import logo from './logo.png';

interface Player {
  name: string;
  position: string[];
  height: string;
  overall: string;
  image?: string;
  jersey: string;
  extraData?: string;
  team: string;
}

const MaxAttempts = 5; //Max Attempts

//getting players higher than rating 85
export default function Home(props: any) {
  const [updatedPlayerData, setUpdatedPlayerData] = useState(false);
  const [consecutiveCorrectGuesses, setConsecutiveCorrectGuesses] = useState(0); // Track consecutive correct guesses
  const [stars, setStars] = useState(0);

  const [showJersey, setShowJersey] = useState(false); //To show Jersey
  const [showTeam, setShowTeam] = useState(false); //To show Team
  const [showResult, setShowResult] = useState(false); //To show result
  const [showRules, setShowRules] = useState(false); //To show Rules
  const modalDisplay2 = showResult ? 'block' : 'none'; //How to Display popup
  const modalDisplay = showRules ? 'block' : 'none'; //How to Display popup
  const [selectedRating, setSelectedRating] = useState(90);
  const [players, setPlayers] = useState<Player[]>(
    getRandomPlayers(playerData, 60, 85)
  );

  // const handleRating = (rating) => {
  //   setSelectedRating(rating);
  //   if (rating) {
  //     setPlayers(getRandomPlayers(playerData, 60, rating));

  //     handleReroll();
  //   }
  // };

  //random player keys
  const [randomPlayer, setRandomPlayer] = useState<Player>({
    name: '',
    position: [],
    height: '',
    overall: '',

    image: '',
    jersey: '',
    team: '',
  });

  const [reveal, setReveal] = useState<boolean>(false); //revealing state
  const [correctGuess, setCorrectGuess] = useState(false); //checking correct guess
  const inputRefs = useRef<HTMLInputElement[][]>([]); //Allows us to type

  //allowing to move foward and backwards with keyboard
  const [attemptSubmitted, setAttemptSubmitted] = useState(false);

  const Rulespopup = () => {
    setShowRules(!showRules);
  };

  const Resultpopup = () => {
    setShowResult(!showResult);
  };
  //Everytime pleyer state changes this will be called
  useEffect(() => {
    setRandomPlayer(getRandomItem(players));
  }, [players]);

  //random player is the playerobj i want the name of the random player
  const { name } = randomPlayer; // Lebron James

  //making it uppercase
  const playerName = name.toUpperCase(); // LEBRON JAMES
  //checking the current attempt. only 5 attempts allowed
  const [currentAttempt, setCurrentAttempt] = useState(0);
  const [incorrectAttempt, setIncorrectAttempt] = useState(0);
  //5 guesses each row will have the amount of letters the random player has
  const [guesses, setGuesses] = useState(
    Array(MaxAttempts)
      .fill('')
      .map(() => Array(playerName).fill(''))
  );
  //5 rows same so we can initialize the colors
  const [colors, setColors] = useState(
    Array(MaxAttempts)
      .fill('')
      .map(() => Array(playerName).fill(''))
  );

  //to move forward and backwards and type with keyboard

  // Focus on the first input box when component mounts
  useEffect(() => {
    // Focus on the first input box when component mounts
    if (typeof window !== 'undefined' && inputRefs.current[0]?.[0]) {
      inputRefs.current[0][0].focus();
    }
  }, []);
  //handle input change.
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    attemptIndex: any,
    index: any
  ) => {
    //capitalizing value
    let value = e.target.value.toUpperCase();

    //if value less or equal to 1, create a shallow array of guesses and assign the value to the current attempt and the current index
    //then set it to guesses
    if (value.length <= 1) {
      const newGuesses = [...guesses];
      newGuesses[attemptIndex][index] = value;
      setGuesses(newGuesses);

      //next indext to move to next index
      let nextIndex = index + 1;
      //checking if its equal to a space or a dash we will increment index.
      if (
        nextIndex < playerName.length &&
        (playerName[nextIndex] === ' ' || playerName[nextIndex] === '-')
      ) {
        nextIndex++;
      }
      //either it will go to the next input box if theres no space next or it will go to the next box that can place a letter
      if (nextIndex < playerName.length) {
        inputRefs.current[attemptIndex][nextIndex]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: KeyboardEvent<HTMLInputElement>,
    attemptIndex: number,
    index: number
  ) => {
    let previndex = index - 1;
    let nextindex = index + 1;

    // Handle left arrow key press
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      // If current index is 0, don't move left
      if (index === 0) return;
      // Move focus to the left input box
      inputRefs.current[attemptIndex][previndex]?.focus();
    }

    // Handle right arrow key press
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      // If current index is the last index, don't move right
      if (index === playerName.length - 1) return;
      // Move focus to the right input box
      inputRefs.current[attemptIndex][nextindex]?.focus();
    }

    //if i press the backspace im going to create a shallow array of userGuess
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newGuesses = [...guesses];
      //if index is same length as name and is a letter delete letter and stay on same box
      if (
        index === playerName.length - 1 &&
        /[a-zA-Z]/.test(guesses[attemptIndex][index])
      ) {
        newGuesses[attemptIndex][index] = '';
        setGuesses(newGuesses);

        inputRefs.current[attemptIndex][index]?.focus();
        //if its only the same length as name, delete and go back one box
      } else if (index === playerName.length - 1) {
        newGuesses[attemptIndex][index - 1] = '';
        setGuesses(newGuesses);
        inputRefs.current[attemptIndex][index - 1]?.focus();
      }
      //if it doesnt equal length and the prev index value is a space or a dash decrement prev index value
      if (
        index !== playerName.length - 1 &&
        previndex >= 0 &&
        (playerName[previndex] === ' ' || playerName[previndex] === '-')
      ) {
        previndex--;
      }
      //if it doesnt equal length of name and prev index is greater than 0, delter and go back either one or two boxes
      if (index !== playerName.length - 1 && previndex >= 0) {
        newGuesses[attemptIndex][previndex] = '';
        setGuesses(newGuesses);
        inputRefs.current[attemptIndex][previndex]?.focus();
      }
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
      // if its less than Max attempt, fous to the next currentattempt
      if (currentAttempt + 1 < MaxAttempts) {
        inputRefs.current[currentAttempt + 1][0]?.focus();
      }
    }
  };

  //test if correct
  const handleSubmit = () => {
    if (guesses[currentAttempt]) {
      //joining the current attempt guess
      const guess = guesses[currentAttempt].join('');

      //taking away dashed and spaces
      const playerNamefix = playerName.replace(/\s/g, '').replace(/[-"']/g, '');

      //if guess which is all capatilized no space is equal to playername which is taking away all spaces and is already uppercased,
      //set correct guess and reveal to true
      if (guess === playerNamefix) {
        setCorrectGuess(true);
        setReveal(true);
        setShowResult(true);
        setConsecutiveCorrectGuesses(consecutiveCorrectGuesses + 1);
        setStars(stars + 1); // Increment star count

        if (consecutiveCorrectGuesses === 5) {
          setUpdatedPlayerData(true);
          setConsecutiveCorrectGuesses(0);
        }

        //else we are creating shallow array of colors, for loop through playername
      } else {
        const newColors = [...colors];
        for (let i = 0; i < playerName.length; i++) {
          if (guesses[currentAttempt][i] === playerName[i]) {
            newColors[currentAttempt][i] = 'green';
            //includes the guess letter and the guess is a
          } else if (
            playerName.includes(guesses[currentAttempt][i]) &&
            /[A-Z]/.test(guesses[currentAttempt][i])
          ) {
            newColors[currentAttempt][i] = 'yellow';
          } else {
            newColors[currentAttempt][i] = 'red';
          }
        }

        //setting color to newColors and setting current attempt by incrementing the currentAttempt
        setColors(newColors);

        setCurrentAttempt(currentAttempt + 1);

        //if currentAttempt is === to max attempts reveal the player
        if (currentAttempt + 1 === MaxAttempts) {
          setCorrectGuess(false);
          setReveal(true);
          setShowResult(true);
          setConsecutiveCorrectGuesses(0);
        }
        setIncorrectAttempt(incorrectAttempt + 1);
        //if more than 2 incorrect attempts, we will set jersey to true to display jersey
        if (incorrectAttempt >= 2) {
          setShowJersey(true);
        }
        //if more than 3 we will set team to true to display team
        if (incorrectAttempt >= 3) {
          setShowTeam(true);
        }
      }
    }
  };

  const isNumber = (jersey: string) => {
    if (typeof jersey === 'number') {
      return true;
    }
    return false;
  };
  //hint for the client to guess the player giving them the position, height and overall.
  const Hints = () => {
    const { position, height, jersey, overall, team } = randomPlayer;

    return (
      <div className={styles.hintsContainer}>
        <div className={styles.hintsContent}>
          <p className={styles.hintItem}>
            Position: {position[0]} {position[1]}
          </p>
          {height && <p className={styles.hintItem}>Height: {height}</p>}
          {showJersey && <p className={styles.jersey}>Jersey : {jersey}</p>}
          {showTeam && <p className={styles.team}>Team: {team}</p>}
          <p className={styles.hintItem}>Overall: {overall}</p>
        </div>
      </div>
    );
  };

  //rerolling function
  const handleReroll = () => {
    //getting a new player
    const newPlayer = getRandomItem(players);
    setRandomPlayer(newPlayer);
    //setting Guesses back to empty arrays
    setGuesses(
      Array.from({ length: MaxAttempts }, () =>
        Array(newPlayer.name.length).fill('')
      )
    );
    //setting colors back to empty arrays
    setColors(
      Array.from({ length: MaxAttempts }, () =>
        Array(newPlayer.name.length).fill('')
      )
    );
    //reset all states
    setCurrentAttempt(0);
    setReveal(false);
    setCorrectGuess(false);
    setIncorrectAttempt(0);
    setShowJersey(false);
    setShowTeam(false);

    inputRefs.current = [];
  };
  //Answer Correctly function
  const AnswerCorrectly = () => {
    if (correctGuess === false) {
      setStars(0);
      setConsecutiveCorrectGuesses(0);
    }
    return (
      <div>
        {correctGuess ? (
          <p className={styles.correct}>Correct! The player is {name}</p>
        ) : (
          <p className={styles.incorrect}>
            Incorrect! The player is {name}. Press Reroll to try again.
          </p>
        )}
        {randomPlayer.image ? (
          <Image
            className={styles.image}
            src={randomPlayer.image}
            alt="player image"
            height={150}
            width={110}
          />
        ) : (
          <Image
            className={styles.image}
            alt="Placeholder Player Image"
            src="/noPlayerImage.png"
          />
        )}
      </div>
    );
  };

  //pushing each row in the box
  const inputBoxes = [];
  //for loop through atempts to get each row in each attempt
  for (let attemptIndex = 0; attemptIndex < MaxAttempts; attemptIndex++) {
    const row = [];
    for (let i = 0; i < playerName.length; i++) {
      // if letter is a space, create a space span
      if (playerName[i] === ' ') {
        row.push(
          <span key={`${attemptIndex}-${i}`} className={styles.space}>
            &nbsp;
          </span>
        );
        //auto fill dashes
      } else if (playerName[i] === '-') {
        row.push(
          <input
            key={`${attemptIndex}-${i}`}
            type="text"
            value="-"
            disabled
            className={`${styles.inputBox}`}
          />
        );
      }

      //else push it in row with props key ones, key is ex(0-0)
      else {
        row.push(
          <input
            key={`${attemptIndex}-${i}`}
            ref={(el) => {
              if (el && !inputRefs.current[attemptIndex]) {
                inputRefs.current[attemptIndex] = new Array(playerName.length);
              }
              if (inputRefs.current[attemptIndex]) {
                inputRefs.current[attemptIndex][i] = el as HTMLInputElement;
              }
            }}
            type="text"
            maxLength={1}
            //value will be the current index of the attempt
            value={guesses[attemptIndex][i]}
            //on Change will allow it to change based on function
            onChange={(e) => handleInputChange(e, attemptIndex, i)}
            //allows to type forward and backwards
            onKeyDown={(e) => handleKeyDown(e, attemptIndex, i)}
            //class so we can style each Input Box and style for each box color depending on the color given in the state color
            className={`${styles.inputBox} ${styles[colors[attemptIndex][i]]}`}
          />
        );
      }
    }
    //pushing each row in inputBoxes
    inputBoxes.push(
      <div key={`row-${attemptIndex}`} className={styles.row}>
        {row}
      </div>
    );
  }

  // const displayStars = () => {
  //   let allStars = [];
  //   for (let i = 0; i < stars; i++) {
  //     const eachStar = i;
  //     allStars.push(<span key={i}>⭐</span>);
  //   }
  //   return allStars;
  // };

  // style = {{backgroundColor : randomPlayer.team}
  return (
    <main className={styles.main}>
      {/* <div className={styles.stars}>{displayStars()}</div> */}
      <div className={styles.description}>
        <Image
          className={styles.logo1}
          src={logo}
          alt="Logo"
          width={100}
          height={125}
        />
        <div className={styles.name}>
          <span className={styles.titlefirst}>Guess The </span>
          <span className={styles.titleSecond}>&nbsp;NBA Player</span>
        </div>

        <Image
          className={styles.logo2}
          src={logo}
          alt="Logo"
          width={100}
          height={125}
        />
      </div>

      <div className={styles.container}>
        {/* <div className={styles.ratingSelection}>
          <p>Select Player Rating:</p>

          <button onClick={() => handleRating(70)}>70+</button>
          <button onClick={() => handleRating(80)}>80+</button>
          <button onClick={() => handleRating(90)}>90+</button>
        </div> */}

        <div className={styles.hints}>{Hints()}</div>

        <div className={styles.inputRow}>{inputBoxes}</div>

        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={handleSubmit}>
            Submit
          </button>

          <button className={styles.button} onClick={handleReroll}>
            Reroll
          </button>

          <button className={styles.button} onClick={Rulespopup}>
            {showRules ? null : 'Show Rules'}
          </button>
        </div>
      </div>

      {/* if reveal is true we will popup the answer if its correct or not */}
      {reveal && (
        <div className={styles.popup} style={{ display: modalDisplay2 }}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={Resultpopup}>
              &times;
            </span>
            <AnswerCorrectly />
          </div>
        </div>
      )}

      {showRules && (
        <div className={styles.popup} style={{ display: modalDisplay }}>
          <div className={styles.popupContent}>
            <span className={styles.close} onClick={Rulespopup}>
              &times;
            </span>
            <Rules />
          </div>
        </div>
      )}
    </main>
  );
}
