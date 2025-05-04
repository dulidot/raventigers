import { Stack, router } from 'expo-router';
import React from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGame } from '../context/GameContext';

export default function Leaderboard() {
  const { leaderboard } = useGame();

  const getScoreColor = (index: number) => {
    switch (index) {
      case 0:
        return '#f1c40f'; // Gold
      case 1:
        return '#bdc3c7'; // Silver
      case 2:
        return '#d35400'; // Bronze
      default:
        return '#ecf0f1';
    }
  };

  const getMedal = (index: number) => {
    switch (index) {
      case 0:
        return '🥇';
      case 1:
        return '🥈';
      case 2:
        return '🥉';
      default:
        return `#${index + 1}`;
    }
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{
          title: 'Top Tigers',
          headerStyle: {
            backgroundColor: '#2c3e50',
          },
          headerTintColor: '#fff',
          headerLeft: () => (
            <TouchableOpacity 
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Text style={styles.backButtonText}>←</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>🏆 Hall of Fame 🏆</Text>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {leaderboard.map((entry, index) => (
          <Animated.View 
            key={entry.playerId} 
            style={[
              styles.entryContainer,
              { 
                transform: [{ scale: 1 }],
                backgroundColor: index < 3 ? '#2c3e50' : '#34495e',
              }
            ]}
          >
            <View style={[styles.rankContainer, { backgroundColor: getScoreColor(index) }]}>
              <Text style={styles.rankText}>{getMedal(index)}</Text>
            </View>
            <View style={styles.playerInfoContainer}>
              <Text style={[styles.playerName, { color: getScoreColor(index) }]}>
                {entry.playerName}
              </Text>
              <Text style={styles.date}>
                {new Date(entry.date).toLocaleDateString()}
              </Text>
            </View>
            <View style={[styles.scoreContainer, { backgroundColor: getScoreColor(index) }]}>
              <Text style={styles.scoreText}>{entry.score}</Text>
            </View>
          </Animated.View>
        ))}
        
        {leaderboard.length === 0 && (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No scores yet!</Text>
            <Text style={styles.emptySubText}>Be the first to save the tiger!</Text>
            <TouchableOpacity 
              style={styles.playButton}
              onPress={() => router.push('/game')}
            >
              <Text style={styles.playButtonText}>Play Now</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495e',
  },
  backButton: {
    marginLeft: 10,
    padding: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerContainer: {
    padding: 20,
    backgroundColor: '#2c3e50',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#465c71',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f1c40f',
  },
  scrollView: {
    flex: 1,
    padding: 10,
  },
  entryContainer: {
    flexDirection: 'row',
    marginVertical: 5,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rankContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rankText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  playerInfoContainer: {
    flex: 1,
    marginLeft: 15,
  },
  playerName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  date: {
    fontSize: 12,
    color: '#95a5a6',
    marginTop: 2,
  },
  scoreContainer: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
    minWidth: 60,
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    fontSize: 24,
    color: '#ecf0f1',
    fontWeight: 'bold',
  },
  emptySubText: {
    fontSize: 16,
    color: '#95a5a6',
    marginTop: 10,
    marginBottom: 30,
  },
  playButton: {
    backgroundColor: '#27ae60',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
}); 