import React, { useState, useRef, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors } from '../../constants/colors';
import { FEATURED_VERSES, getVerseReference } from '../../data/bibleData';

const { height } = Dimensions.get('window');
const RECENT_VERSES_KEY = 'recentVerseIndices';
const MAX_RECENT = 30;

function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * FEATURED_VERSES.length));
  const [recentIndices, setRecentIndices] = useState<number[]>([]);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const isInitialized = useRef(false);

  useEffect(() => {
    const loadRecent = async () => {
      try {
        const stored = await AsyncStorage.getItem(RECENT_VERSES_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setRecentIndices(parsed);
            const availableIndices = FEATURED_VERSES.map((_, i) => i).filter(i => !parsed.includes(i));
            if (availableIndices.length > 0) {
              const shuffled = shuffleArray(availableIndices);
              setCurrentIndex(shuffled[0]);
            }
          }
        }
        isInitialized.current = true;
      } catch {
        isInitialized.current = true;
      }
    };
    loadRecent();
  }, []);

  useEffect(() => {
    if (isInitialized.current && recentIndices.length > 0) {
      AsyncStorage.setItem(RECENT_VERSES_KEY, JSON.stringify(recentIndices)).catch(() => {});
    }
  }, [recentIndices]);

  const getNextIndex = useCallback(() => {
    const availableIndices = FEATURED_VERSES.map((_, i) => i).filter(i => !recentIndices.includes(i));
    
    if (availableIndices.length === 0) {
      const keepRecent = recentIndices.slice(-5);
      setRecentIndices(keepRecent);
      const newAvailable = FEATURED_VERSES.map((_, i) => i).filter(i => !keepRecent.includes(i));
      const shuffled = shuffleArray(newAvailable);
      return shuffled[0] ?? 0;
    }
    
    const shuffled = shuffleArray(availableIndices);
    return shuffled[0];
  }, [recentIndices]);

  const handleTap = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      const nextIndex = getNextIndex();
      setCurrentIndex(nextIndex);
      
      setRecentIndices(prev => {
        const updated = [...prev, nextIndex];
        return updated.slice(-MAX_RECENT);
      });
      
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim, getNextIndex]);

  const currentVerse = FEATURED_VERSES[currentIndex];

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        <View style={styles.crossContainer} pointerEvents="none">
          <View style={styles.cross}>
            <View style={styles.crossVertical} />
            <View style={styles.crossHorizontal} />
          </View>
        </View>

        <View style={styles.contentContainer}>
          <Animated.View style={[styles.verseContainer, { opacity: fadeAnim }]}>
            <Text style={styles.verseText}>"{currentVerse.text}"</Text>
            <Text style={styles.verseReference}>
              {getVerseReference(currentVerse)}
            </Text>
          </Animated.View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  crossContainer: {
    position: 'absolute',
    top: height * 0.25,
    left: 0,
    right: 0,
    height: height * 0.25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cross: {
    width: 90,
    height: 135,
    alignItems: 'center',
    justifyContent: 'center',
  },
  crossVertical: {
    position: 'absolute',
    width: 14,
    height: 135,
    backgroundColor: Colors.black,
    borderRadius: 7,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 74,
    height: 14,
    backgroundColor: Colors.black,
    borderRadius: 7,
    top: 26,
  },
  contentContainer: {
    position: 'absolute',
    top: height * 0.53,
    left: 0,
    right: 0,
    bottom: 120,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  verseContainer: {
    alignItems: 'center',
  },
  verseText: {
    fontSize: 20,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 32,
    fontWeight: '400',
    letterSpacing: -0.3,
  },
  verseReference: {
    fontSize: 18,
    color: Colors.textSecondary,
    marginTop: 40,
    fontWeight: '500',
  },
});
