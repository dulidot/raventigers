import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, Stack } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    Keyboard,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View,
} from 'react-native';

function PlayerScreen() {
  const [playerName, setPlayerName] = useState('');

  const handleStartGame = async () => {
    if (playerName.trim().length === 0) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    try {
      // Save the current player name
      await AsyncStorage.setItem('currentPlayer', playerName.trim());
      // Navigate to the game
      router.push('/game');
    } catch (error) {
      console.error('Error saving player name:', error);
      Alert.alert('Error', 'Could not save player name');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Stack.Screen 
          options={{
            title: 'Enter Your Name',
            headerStyle: {
              backgroundColor: '#1b5e20',
            },
            headerTintColor: '#fff',
          }} 
        />
        <View style={styles.content}>
          <Text style={styles.title}>Enter Your Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Your Name"
            placeholderTextColor="#88c399"
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
            autoFocus
          />
          <TouchableOpacity 
            style={styles.button}
            onPress={handleStartGame}
          >
            <Text style={styles.buttonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2e7d32',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    paddingHorizontal: 15,
    fontSize: 18,
    marginBottom: 20,
    color: '#2e7d32',
  },
  button: {
    backgroundColor: '#1b5e20',
    padding: 15,
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default PlayerScreen; 