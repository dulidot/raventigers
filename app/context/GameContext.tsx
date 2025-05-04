import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { DIFFICULTY_LEVELS, GameState, GameStatus, LeaderboardEntry, WORDS_BY_LEVEL } from '../types/game';

interface GameContextType {
  gameState: GameState;
  leaderboard: LeaderboardEntry[];
  startNewGame: () => void;
  guessLetter: (letter: string) => void;
  updateLeaderboard: (playerName: string) => Promise<void>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>({
    word: '',
    hint: '',
    guessedLetters: [],
    remainingAttempts: 6,
    score: 0,
    level: 1,
    gameStatus: 'playing'
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboard();
    startNewGame();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const storedLeaderboard = await AsyncStorage.getItem('leaderboard');
      if (storedLeaderboard) {
        setLeaderboard(JSON.parse(storedLeaderboard));
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    }
  };

  const startNewGame = () => {
    const level = gameState.level;
    const words = WORDS_BY_LEVEL[level as keyof typeof WORDS_BY_LEVEL];
    const randomWordObj = words[Math.floor(Math.random() * words.length)];
    
    setGameState({
      word: randomWordObj.word,
      hint: randomWordObj.hint,
      guessedLetters: [],
      remainingAttempts: DIFFICULTY_LEVELS[level as keyof typeof DIFFICULTY_LEVELS].attempts,
      score: gameState.score,
      level,
      gameStatus: 'playing'
    });
  };

  const guessLetter = (letter: string) => {
    if (gameState.guessedLetters.includes(letter) || gameState.gameStatus !== 'playing') return;

    const newGuessedLetters = [...gameState.guessedLetters, letter];
    const isCorrectGuess = gameState.word.toUpperCase().includes(letter);
    const level = gameState.level as keyof typeof DIFFICULTY_LEVELS;

    let newScore = gameState.score;
    if (isCorrectGuess) {
      // Add bonus points for consecutive correct guesses
      const consecutiveCorrect = newGuessedLetters.filter(l => 
        gameState.word.toUpperCase().includes(l)
      ).length;
      newScore += DIFFICULTY_LEVELS[level].pointsPerCorrect * (1 + (consecutiveCorrect * 0.1));
    }

    const remainingAttempts = isCorrectGuess 
      ? gameState.remainingAttempts 
      : gameState.remainingAttempts - 1;

    const isWordComplete = gameState.word
      .toUpperCase()
      .split('')
      .every(char => newGuessedLetters.includes(char));

    let newGameStatus: GameStatus = 'playing';
    if (isWordComplete) {
      newGameStatus = 'won';
    } else if (remainingAttempts === 0) {
      newGameStatus = 'lost';
    }

    setGameState({
      ...gameState,
      guessedLetters: newGuessedLetters,
      remainingAttempts,
      score: Math.round(newScore),
      gameStatus: newGameStatus
    });
  };

  const progressToNextLevel = () => {
    if (gameState.level < 3) {
      setGameState(prev => {
        const nextLevel = prev.level + 1;
        const words = WORDS_BY_LEVEL[nextLevel as keyof typeof WORDS_BY_LEVEL];
        const randomWordObj = words[Math.floor(Math.random() * words.length)];
        
        return {
          word: randomWordObj.word,
          hint: randomWordObj.hint,
          guessedLetters: [],
          remainingAttempts: DIFFICULTY_LEVELS[nextLevel as keyof typeof DIFFICULTY_LEVELS].attempts,
          score: prev.score,
          level: nextLevel,
          gameStatus: 'playing'
        };
      });
    } else {
      startNewGame();
    }
  };

  useEffect(() => {
    if (gameState.gameStatus === 'won') {
      setTimeout(() => {
        progressToNextLevel();
      }, 2000);
    }
  }, [gameState.gameStatus]);

  const updateLeaderboard = async (playerName: string) => {
    const newEntry: LeaderboardEntry = {
      playerId: Date.now().toString(),
      playerName,
      score: gameState.score,
      date: new Date().toISOString()
    };

    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);

    setLeaderboard(updatedLeaderboard);
    try {
      await AsyncStorage.setItem('leaderboard', JSON.stringify(updatedLeaderboard));
    } catch (error) {
      console.error('Error saving leaderboard:', error);
    }
  };

  return (
    <GameContext.Provider 
      value={{ 
        gameState, 
        leaderboard, 
        startNewGame, 
        guessLetter, 
        updateLeaderboard 
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};

// Add a default export to satisfy the router requirements
export default function GameContextPage() {
  return null;
} 