import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Dimensions, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';
import audioService from '../services/AudioService';

const KEYBOARD_LETTERS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
];

// Tiger ASCII art states based on remaining attempts
const TIGER_STATES = {
  6: `
  ╔═══╗
  ║   
  ║   
  ║   
  ║   
  ║   
══╩═══`,
  5: `
  ╔═══╗
  ║   🪢
  ║   
  ║   
  ║   
  ║   
══╩═══`,
  4: `
  ╔═══╗
  ║   🪢
  ║   
  ║   
  ║   
  ║   
══╩═══`,
  3: `
  ╔═══╗
  ║   🪢
  ║   
  ║   
  ║   
  ║   
══╩═══`,
  2: `
  ╔═══╗
  ║   🪢
  ║   
  ║   
  ║   
  ║   
══╩═══`,
  1: `
  ╔═══╗
  ║   🪢
  ║   
  ║   
  ║   
  ║   
══╩═══`,
  0: `
  ╔═══╗
  ║   🪢
  ║   
  ║   
  ║   
  ║   
══╩═══`
};

// Get screen dimensions
const { width: SCREEN_WIDTH } = Dimensions.get('window');
// Calculate key size based on screen width with more padding
const KEY_WIDTH = (SCREEN_WIDTH - 80) / 10; // Increased padding to make keys smaller

export default function Hangman() {
  const { gameState, guessLetter, startNewGame, updateLeaderboard } = useGame();
  const [isMuted, setIsMuted] = useState(false);
  const tigerPosition = useRef(new Animated.Value(35)).current;

  useEffect(() => {
    // Initialize audio
    const setupAudio = async () => {
      try {
        await audioService.loadBackgroundMusic();
        await audioService.loadSoundEffects();
        await audioService.playBackgroundMusic();
      } catch (error) {
        console.warn('Error setting up audio:', error);
        // Continue without audio
      }
    };
    setupAudio();

    // Cleanup on unmount
    return () => {
      try {
        audioService.unloadAll();
      } catch (error) {
        console.warn('Error cleaning up audio:', error);
      }
    };
  }, []);

  // Add animation effect when remaining attempts change
  useEffect(() => {
    if (gameState.remainingAttempts < 6) {
      const dropDistance = 35 + ((6 - gameState.remainingAttempts) * 40);
      Animated.timing(tigerPosition, {
        toValue: dropDistance,
        duration: 1000, // 1 second animation
        useNativeDriver: true,
      }).start();
    }
  }, [gameState.remainingAttempts]);

  const handleMuteToggle = async () => {
    const newMutedState = await audioService.toggleMute();
    setIsMuted(newMutedState);
  };

  const renderWord = () => {
    return gameState.word.toUpperCase().split('').map((letter, index) => (
      <View key={index} style={styles.letterContainer}>
        <Text style={styles.letter}>
          {gameState.guessedLetters.includes(letter) ? letter : '_'}
        </Text>
      </View>
    ));
  };

  const handleLetterPress = async (letter: string) => {
    if (!gameState.guessedLetters.includes(letter)) {
      const isCorrect = gameState.word.toUpperCase().includes(letter);
      try {
        await audioService.playSound(isCorrect ? 'correct' : 'wrong');
      } catch (error) {
        console.warn('Error playing sound:', error);
      }
      guessLetter(letter);
    }
  };

  const handleGameEnd = async () => {
    try {
      const currentPlayer = await AsyncStorage.getItem('currentPlayer');
      
      if (gameState.gameStatus === 'won') {
        if (currentPlayer) {
          await updateLeaderboard(currentPlayer);
          
          if (gameState.level < 3) {
            try {
              await audioService.playSound('levelUp');
            } catch (error) {
              console.warn('Error playing level up sound:', error);
            }
            Alert.alert(
              '🎉 Level Complete! 🎉',
              `Congratulations ${currentPlayer}!\n\nScore: ${gameState.score}\n\nGet ready for Level ${gameState.level + 1}!\n${
                gameState.level === 1 
                  ? '🐯 Time for some harder words about tiger species and behavior!'
                  : '🐯 Final level! Test your knowledge about tiger conservation!'
              }`
            );
          } else {
            try {
              await audioService.playSound('win');
            } catch (error) {
              console.warn('Error playing win sound:', error);
            }
            Alert.alert(
              '🏆 Game Complete! 🏆',
              `Amazing job ${currentPlayer}!\n\nYou've mastered all levels!\nFinal Score: ${gameState.score}`,
              [{ text: 'Play Again', onPress: startNewGame }]
            );
          }
        }
      } else if (gameState.gameStatus === 'lost') {
        try {
          await audioService.playSound('lose');
        } catch (error) {
          console.warn('Error playing lose sound:', error);
        }
        const levelMessages = {
          1: 'Don\'t give up! These are simple tiger-related words.',
          2: 'Keep trying! Learn about different tiger species.',
          3: 'Almost there! Test your conservation knowledge.'
        };
        
        Alert.alert(
          'Game Over',
          `The tiger didn't make it...\nThe word was: ${gameState.word}\n\n${levelMessages[gameState.level as keyof typeof levelMessages]}`,
          [{ text: 'Try Again', onPress: startNewGame }]
        );
      }
    } catch (error) {
      console.error('Error handling game end:', error);
    }
  };

  useEffect(() => {
    if (gameState.gameStatus !== 'playing') {
      handleGameEnd();
    }
  }, [gameState.gameStatus]);

  const renderKey = (letter: string) => {
    const isGuessed = gameState.guessedLetters.includes(letter);
    const isCorrect = gameState.word.includes(letter) && isGuessed;
    
    return (
      <Pressable
        key={letter}
        onPress={() => handleLetterPress(letter)}
        disabled={isGuessed}
        style={({ pressed }) => [
          styles.key,
          isGuessed && styles.keyGuessed,
          isCorrect && styles.keyCorrect,
          pressed && styles.keyPressed
        ]}
      >
        <Text style={[
          styles.keyText,
          isGuessed && styles.keyTextGuessed
        ]}>
          {letter}
        </Text>
      </Pressable>
    );
  };

  const renderTigerState = (remainingAttempts: number) => {
    return (
      <View style={styles.tigerContainer}>
        <View style={styles.tigerStateWrapper}>
          <Text style={styles.tigerArt}>
            {TIGER_STATES[remainingAttempts as keyof typeof TIGER_STATES]}
          </Text>
          {remainingAttempts < 6 && (
            <Animated.Image
              source={require('../../assets/images/hanging-tiger.png')}
              style={[
                styles.tigerImage,
                {
                  position: 'absolute',
                  transform: [{ translateY: tigerPosition }],
                  left: '50%',  // Center the tiger
                  marginLeft: -175, // Adjust this value to move tiger left (-) or right (+)
                }
              ]}
            />
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Save the Tiger!',
          headerStyle: {
            backgroundColor: '#1b5e20',
          },
          headerTintColor: '#fff',
          headerRight: () => (
            <TouchableOpacity 
              onPress={handleMuteToggle}
              style={styles.muteButton}
            >
              <Text style={styles.muteButtonText}>
                {isMuted ? '🔇' : '🔊'}
              </Text>
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.gameContainer}>
        <View>
          <View style={styles.statsContainer}>
            <Text style={styles.statsText}>Level: {gameState.level}</Text>
            <Text style={styles.statsText}>Score: {gameState.score}</Text>
            <Text style={styles.statsText}>Lives: {gameState.remainingAttempts}</Text>
          </View>

          <View style={styles.wordContainer}>
            {renderWord()}
          </View>

          <View style={styles.hintContainer}>
            <Text style={styles.hintLabel}>Hint:</Text>
            <Text style={styles.hintText}>{gameState.hint}</Text>
          </View>

          <View style={styles.guessedContainer}>
            <Text style={styles.guessedLettersText}>
              Guessed: {gameState.guessedLetters.join(', ')}
            </Text>
          </View>
        </View>

        <View style={styles.gameplayArea}>
          {renderTigerState(gameState.remainingAttempts)}
        </View>

        <View style={styles.keyboardContainer}>
          {KEYBOARD_LETTERS.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.keyboardRow}>
              {row.map(letter => renderKey(letter))}
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
    padding: 20,
  },
  gameContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  gameplayArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  tigerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  tigerStateWrapper: {
    position: 'relative',
    alignItems: 'center',
    width: '100%',
  },
  tigerArt: {
    color: '#ffffff',
    fontFamily: 'monospace',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'center',
  },
  tigerImage: {
    width: 70,  // Slightly reduced size for better proportion
    height: 70,
    resizeMode: 'contain',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    backgroundColor: '#1b5e20',
    padding: 10,
    borderRadius: 10,
  },
  statsText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  wordContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
    flexWrap: 'wrap',
  },
  letterContainer: {
    borderBottomWidth: 2,
    borderBottomColor: '#ffffff',
    marginHorizontal: 4,
    width: 25,
    alignItems: 'center',
  },
  letter: {
    fontSize: 22,
    color: '#ffffff',
    fontWeight: 'bold',
  },
  hintContainer: {
    backgroundColor: '#1b5e20',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    alignItems: 'center',
  },
  hintLabel: {
    color: '#fdd835',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  hintText: {
    color: '#ffffff',
    fontSize: 16,
    textAlign: 'center',
  },
  guessedContainer: {
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#1b5e20',
    borderRadius: 10,
  },
  guessedLettersText: {
    color: '#ffffff',
    fontSize: 14,
  },
  keyboardContainer: {
    backgroundColor: '#1b5e20',
    borderRadius: 10,
    padding: 8,
    alignSelf: 'stretch',
    marginTop: 'auto',
    marginHorizontal: 10,
  },
  keyboardRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 4,
  },
  key: {
    backgroundColor: '#4caf50',
    width: KEY_WIDTH,
    height: KEY_WIDTH * 1.1, // Slightly reduced height ratio
    margin: 1.5, // Reduced margin
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  keyText: {
    color: '#ffffff',
    fontSize: Math.min(KEY_WIDTH * 0.45, 18), // Reduced font size
    fontWeight: 'bold',
  },
  keyPressed: {
    backgroundColor: '#388e3c',
    transform: [{ scale: 0.95 }],
  },
  keyGuessed: {
    backgroundColor: '#81c784',
    opacity: 0.7,
  },
  keyCorrect: {
    backgroundColor: '#fdd835',
  },
  keyTextGuessed: {
    color: '#1b5e20',
  },
  muteButton: {
    padding: 10,
    marginRight: 10,
  },
  muteButtonText: {
    fontSize: 24,
  },
}); 