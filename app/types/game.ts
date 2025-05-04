export interface Player {
  id: string;
  name: string;
  score: number;
}

export interface GameState {
  word: string;
  hint: string;
  guessedLetters: string[];
  remainingAttempts: number;
  score: number;
  level: number;
  gameStatus: GameStatus;
}

export type GameStatus = 'playing' | 'won' | 'lost';

export interface LeaderboardEntry {
  playerId: string;
  playerName: string;
  score: number;
  date: string;
}

export const DIFFICULTY_LEVELS = {
  1: { attempts: 6, pointsPerCorrect: 10 },  // Easy - More attempts, less points
  2: { attempts: 5, pointsPerCorrect: 25 },  // Medium - Balanced
  3: { attempts: 4, pointsPerCorrect: 50 },  // Hard - Few attempts, high points
}

// Word list with hints
export const WORDS_BY_LEVEL = {
  1: [
    { word: 'TIGER', hint: 'The animal you\'re trying to save!' },
    { word: 'ROAR', hint: 'A loud animal sound' },
    { word: 'PAWS', hint: 'Animal feet' },
    { word: 'WILD', hint: 'Not tame' },
    { word: 'HUNT', hint: 'Search for food' },
    { word: 'CUBS', hint: 'Baby tigers' },
    { word: 'TAIL', hint: 'Long and striped appendage' },
    { word: 'CATS', hint: 'Tiger family' },
    { word: 'CLAW', hint: 'Sharp retractable weapon' },
    { word: 'PREY', hint: 'Animal hunted for food' },
    { word: 'LEAP', hint: 'Jump to catch prey' },
    { word: 'BITE', hint: 'Use teeth to catch prey' },
    { word: 'EYES', hint: 'Night vision helpers' },
    { word: 'SWIM', hint: 'Tigers love doing this in water' },
    { word: 'MEAT', hint: 'Tiger\'s favorite food' }
  ],
  2: [
    { word: 'JUNGLE', hint: 'Natural habitat of many animals' },
    { word: 'STRIPES', hint: 'Tiger\'s pattern' },
    { word: 'PREDATOR', hint: 'Hunts other animals' },
    { word: 'BENGAL', hint: 'A famous tiger species' },
    { word: 'WHISKERS', hint: 'Sensitive facial hair' },
    { word: 'SIBERIAN', hint: 'Largest tiger subspecies' },
    { word: 'SUMATRAN', hint: 'Smallest tiger subspecies' },
    { word: 'NOCTURNAL', hint: 'Active at night' },
    { word: 'TERRITORY', hint: 'Area an animal defends' },
    { word: 'AMBUSH', hint: 'Surprise attack method' },
    { word: 'STALKING', hint: 'Sneaking up on prey' },
    { word: 'HUNTING', hint: 'Searching for food' },
    { word: 'PROWLING', hint: 'Moving stealthily' },
    { word: 'PANTHERA', hint: 'Tiger\'s genus name' },
    { word: 'TIGRESS', hint: 'Female tiger' },
    { word: 'MALAYAN', hint: 'Tiger subspecies from Malaysia' },
    { word: 'INDOCHIN', hint: 'Tiger from Southeast Asia' },
    { word: 'FOREST', hint: 'Wooded habitat' },
    { word: 'GRASSLAND', hint: 'Open habitat type' },
    { word: 'MANGROVE', hint: 'Coastal tiger habitat' }
  ],
  3: [
    { word: 'ENDANGERED', hint: 'At risk of extinction' },
    { word: 'CARNIVORE', hint: 'Meat eater' },
    { word: 'SANCTUARY', hint: 'Safe place for animals' },
    { word: 'CONSERVATION', hint: 'Protection of nature' },
    { word: 'BIODIVERSITY', hint: 'Variety of life in an ecosystem' },
    { word: 'EXTINCTION', hint: 'Permanent loss of a species' },
    { word: 'POACHING', hint: 'Illegal hunting' },
    { word: 'HABITAT', hint: 'Natural home of an animal' },
    { word: 'ECOSYSTEM', hint: 'Community of living things' },
    { word: 'PRESERVATION', hint: 'Protecting from harm' },
    { word: 'PROTECTION', hint: 'Keeping safe from harm' },
    { word: 'WILDLIFE', hint: 'Animals living in nature' },
    { word: 'THREATENED', hint: 'At risk of endangerment' },
    { word: 'POPULATION', hint: 'Number of tigers remaining' },
    { word: 'REINTRODUCTION', hint: 'Bringing tigers back to an area' },
    { word: 'DEFORESTATION', hint: 'Loss of forest habitat' },
    { word: 'FRAGMENTATION', hint: 'Breaking up of habitat' },
    { word: 'REHABILITATION', hint: 'Helping injured tigers recover' },
    { word: 'ANTIPOACHING', hint: 'Stopping illegal hunting' },
    { word: 'SUSTAINABLE', hint: 'Long-term survival approach' }
  ]
};

// Add a default export to satisfy the router requirements
export default function GameTypes() {
  return null;
} 