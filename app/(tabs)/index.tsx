import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Dimensions,
} from 'react-native';
import { Colors } from '../../constants/colors';
import { FEATURED_VERSES, getVerseReference } from '../../data/bibleData';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const currentVerse = FEATURED_VERSES[currentIndex];

  const handleTap = useCallback(() => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setCurrentIndex((prev) => (prev + 1) % FEATURED_VERSES.length);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    });
  }, [fadeAnim]);

  return (
    <TouchableWithoutFeedback onPress={handleTap}>
      <View style={styles.container}>
        {/* Cross - Fixed position, moved down */}
        <View style={styles.crossContainer} pointerEvents="none">
          <View style={styles.cross}>
            <View style={styles.crossVertical} />
            <View style={styles.crossHorizontal} />
          </View>
        </View>

        {/* Verse content - Animated */}
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
    backgroundColor: '#FFFDF9',
  },
  crossContainer: {
    position: 'absolute',
    top: height * 0.20,
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
    backgroundColor: '#000000',
    borderRadius: 7,
  },
  crossHorizontal: {
    position: 'absolute',
    width: 74,
    height: 14,
    backgroundColor: '#000000',
    borderRadius: 7,
    top: 26,
  },
  contentContainer: {
    position: 'absolute',
    top: height * 0.50,
    left: 0,
    right: 0,
    bottom: 120,
    paddingHorizontal: 36,
    alignItems: 'center',
  },
  verseContainer: {
    alignItems: 'center',
  },
  verseText: {
    fontSize: 21,
    fontStyle: 'italic',
    color: '#3D3D3D',
    textAlign: 'center',
    lineHeight: 32,
    letterSpacing: 0.3,
  },
  verseReference: {
    fontSize: 17,
    color: Colors.primary,
    marginTop: 36,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});
