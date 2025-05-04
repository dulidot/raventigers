import { LinearGradient } from 'expo-linear-gradient';
import { Link, Stack, router } from 'expo-router';
import React, { useEffect } from 'react';
import { Animated, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function SplashScreen() {
  const insets = useSafeAreaInsets();
  const fadeAnim = React.useRef(new Animated.Value(0)).current;
  const scaleAnim = React.useRef(new Animated.Value(0.3)).current;
  const tigerDropAnim = React.useRef(new Animated.Value(-200)).current;
  const ropeSwingAnim = React.useRef(new Animated.Value(0)).current;
  const buttonsFadeAnim = React.useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Enhanced sequence of animations
    Animated.sequence([
      // First fade in and scale the title
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 10,
          friction: 2,
          useNativeDriver: true,
        }),
      ]),
      // Then drop the tiger
      Animated.spring(tigerDropAnim, {
        toValue: 0,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      // Swing the rope and fade in buttons
      Animated.parallel([
        Animated.sequence([
          Animated.timing(ropeSwingAnim, {
            toValue: 0.1,
            duration: 500,
            useNativeDriver: true,
          }),
          Animated.timing(ropeSwingAnim, {
            toValue: -0.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(ropeSwingAnim, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(buttonsFadeAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, []);

  const startGame = () => {
    router.push('/player');
  };

  return (
    <LinearGradient
      colors={['#2e7d32', '#1b5e20']}
      style={[styles.container, { paddingTop: insets.top }]}
    >
      <Stack.Screen 
        options={{
          headerShown: false,
        }}
      />
      
      <View style={styles.content}>
        <Animated.View style={[
          styles.titleContainer,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { rotate: ropeSwingAnim.interpolate({
                inputRange: [-1, 1],
                outputRange: ['-20deg', '20deg']
              })}
            ]
          }
        ]}>
          <Text style={styles.titleHang}>Hang</Text>
          <Animated.View style={[
            styles.tigerContainer,
            {
              transform: [{ translateY: tigerDropAnim }]
            }
          ]}>
            <Text style={styles.titleTiger}>Tiger</Text>
            <Image 
              source={require('../assets/images/hanging-tiger.png')}
              style={styles.tigerImage}
            />
          </Animated.View>
        </Animated.View>

        <Animated.View style={[
          styles.buttonContainer,
          {
            opacity: buttonsFadeAnim,
            transform: [{ scale: scaleAnim }]
          }
        ]}>
          <TouchableOpacity 
            style={[styles.button, styles.startButton]}
            onPress={startGame}
          >
            <LinearGradient
              colors={['#4caf50', '#388e3c']}
              style={styles.buttonGradient}
            >
              <Text style={styles.buttonText}>Start Game 🎮</Text>
            </LinearGradient>
          </TouchableOpacity>

          <Link href="/mechanics" asChild>
            <TouchableOpacity style={[styles.button, styles.mechanicsButton]}>
              <LinearGradient
                colors={['#388e3c', '#2e7d32']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>How to Play ❓</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>

          <Link href="/leaderboard" asChild>
            <TouchableOpacity style={[styles.button, styles.leaderboardButton]}>
              <LinearGradient
                colors={['#2e7d32', '#1b5e20']}
                style={styles.buttonGradient}
              >
                <Text style={styles.buttonText}>Leaderboard 🏆</Text>
              </LinearGradient>
            </TouchableOpacity>
          </Link>
        </Animated.View>

        <Animated.Text style={[
          styles.footer,
          {
            opacity: fadeAnim
          }
        ]}>
          Save the tiger by guessing the word! 🌿
        </Animated.Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  titleHang: {
    fontSize: 52,
    fontWeight: 'bold',
    color: '#ffffff',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tigerContainer: {
    alignItems: 'center',
  },
  titleTiger: {
    fontSize: 68,
    fontWeight: 'bold',
    color: '#fdd835',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
  },
  tigerImage: {
    width: 120,
    height: 120,
    marginTop: 10,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
    gap: 20,
  },
  button: {
    borderRadius: 15,
    overflow: 'hidden',
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
  startButton: {
    transform: [{ scale: 1.05 }],
  },
  mechanicsButton: {},
  leaderboardButton: {},
  buttonText: {
    color: '#ffffff',
    fontSize: 22,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  footer: {
    position: 'absolute',
    bottom: 40,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});
