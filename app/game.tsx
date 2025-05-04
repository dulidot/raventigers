import React from 'react';
import { StyleSheet, View } from 'react-native';
import Hangman from './components/Hangman';

export default function GamePage() {
  return (
    <View style={styles.container}>
      <Hangman />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
}); 