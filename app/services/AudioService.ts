import { Audio, InterruptionModeAndroid, InterruptionModeIOS } from 'expo-av';

class AudioService {
  private backgroundMusic: Audio.Sound | null = null;
  private sounds: { [key: string]: Audio.Sound } = {};
  private isMuted: boolean = false;

  constructor() {
    // Set up audio mode for background playback
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: true,
      interruptionModeIOS: InterruptionModeIOS.MixWithOthers,
      interruptionModeAndroid: InterruptionModeAndroid.DuckOthers,
    }).catch(error => console.warn('Error setting audio mode:', error));
  }

  async loadBackgroundMusic() {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sounds/background-music.mp3'),
        {
          isLooping: true,
          shouldPlay: false,
          volume: 0.5,
        }
      );
      this.backgroundMusic = sound;
    } catch (error) {
      console.warn('Error loading background music:', error);
    }
  }

  async loadSoundEffects() {
    try {
      const soundEffects = {
        win: require('../assets/sounds/win.mp3'),
        lose: require('../assets/sounds/lose.mp3'),
        levelUp: require('../assets/sounds/level-up.mp3'),
        correct: null, // Not available yet
        wrong: null    // Not available yet
      };

      for (const [key, source] of Object.entries(soundEffects)) {
        if (!source) {
          console.warn(`Sound effect ${key} not available`);
          continue;
        }
        try {
          const { sound } = await Audio.Sound.createAsync(source, {
            volume: 0.7,
          });
          this.sounds[key] = sound;
        } catch (err) {
          console.warn(`Error loading sound effect ${key}:`, err);
        }
      }
    } catch (error) {
      console.warn('Error loading sound effects:', error);
    }
  }

  async playSound(soundName: 'correct' | 'wrong' | 'win' | 'lose' | 'levelUp') {
    try {
      if (this.isMuted || !this.sounds[soundName]) {
        console.warn(`Sound ${soundName} not available or muted`);
        return;
      }

      const sound = this.sounds[soundName];
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Error playing ${soundName} sound:`, error);
    }
  }

  async playBackgroundMusic() {
    try {
      if (!this.backgroundMusic || this.isMuted) return;
      
      const status = await this.backgroundMusic.getStatusAsync();
      if (!status.isLoaded) {
        await this.loadBackgroundMusic();
      }
      
      if (this.backgroundMusic) {
        await this.backgroundMusic.playAsync();
      }
    } catch (error) {
      console.warn('Error playing background music:', error);
    }
  }

  async pauseBackgroundMusic() {
    try {
      if (!this.backgroundMusic) return;
      await this.backgroundMusic.pauseAsync();
    } catch (error) {
      console.warn('Error pausing background music:', error);
    }
  }

  async toggleMute() {
    try {
      this.isMuted = !this.isMuted;
      if (this.isMuted) {
        await this.pauseBackgroundMusic();
      } else {
        await this.playBackgroundMusic();
      }
      return this.isMuted;
    } catch (error) {
      console.warn('Error toggling mute:', error);
      return this.isMuted;
    }
  }

  async unloadAll() {
    try {
      if (this.backgroundMusic) {
        await this.backgroundMusic.unloadAsync();
        this.backgroundMusic = null;
      }

      for (const sound of Object.values(this.sounds)) {
        try {
          await sound.unloadAsync();
        } catch (err) {
          console.warn('Error unloading sound:', err);
        }
      }
      this.sounds = {};
    } catch (error) {
      console.warn('Error unloading audio:', error);
    }
  }
}

export default new AudioService(); 