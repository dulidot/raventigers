import { LinearGradient } from 'expo-linear-gradient';
import { Stack, router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function MechanicsPage() {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      colors={['#2e7d32', '#1b5e20']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Stack.Screen 
        options={{
          title: 'How to Play',
          headerStyle: {
            backgroundColor: '#2e7d32',
          },
          headerTintColor: '#fff',
          headerShadowVisible: false,
        }}
      />
      
      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <View style={styles.section}>
            <Text style={styles.title}>Game Rules 📋</Text>
            <Text style={styles.text}>
              1. A random word will be chosen for you to guess{'\n'}
              2. You have 6 attempts to guess the word correctly{'\n'}
              3. Each wrong guess brings the tiger closer to danger{'\n'}
              4. Guess letters by tapping on the keyboard below{'\n'}
              5. Save the tiger by completing the word!
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Scoring 🎯</Text>
            <Text style={styles.text}>
              • Correct letter: +10 points{'\n'}
              • Completing a word: +50 points{'\n'}
              • Wrong guess: -5 points{'\n'}
              • Saving the tiger: +100 bonus points
            </Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.title}>Tips 💡</Text>
            <Text style={styles.text}>
              • Start with common vowels (A, E, I, O, U){'\n'}
              • Look for common consonants like R, S, T, N{'\n'}
              • Pay attention to letter patterns{'\n'}
              • Use your remaining guesses wisely
            </Text>
          </View>

          <TouchableOpacity 
            style={styles.button}
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={['#4caf50', '#388e3c']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Got it! 👍</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 24,
    marginBottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  section: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 15,
    textShadowColor: 'rgba(0, 0, 0, 0.1)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  text: {
    fontSize: 18,
    lineHeight: 28,
    color: '#333',
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
}); 