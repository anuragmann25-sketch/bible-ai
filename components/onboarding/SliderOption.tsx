import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, PanResponder, Dimensions, Easing } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80;
const THUMB_SIZE = 28;

interface SliderOptionProps {
  value: number;
  onValueChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
}

export function SliderOption({ value, onValueChange, minLabel = 'Low', maxLabel = 'High' }: SliderOptionProps) {
  const [sliderValue, setSliderValue] = useState(value);
  const [displayPercent, setDisplayPercent] = useState(Math.round(value * 100));
  const pan = useRef(new Animated.Value(value * (SLIDER_WIDTH - THUMB_SIZE))).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const lastHapticPercent = useRef(Math.round(value * 100));

  const translateYAnim = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    // Reset for clean replay on navigation
    opacityAnim.setValue(0);
    translateYAnim.setValue(14);
    scaleAnim.setValue(0.98);
    
    // Calm, intentional animation with initial delay
    const delay = 180;
    const duration = 380;
    
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Listen to pan changes for live percentage update
  useEffect(() => {
    const listenerId = pan.addListener(({ value: panValue }) => {
      const clampedValue = Math.max(0, Math.min(panValue, SLIDER_WIDTH - THUMB_SIZE));
      const percent = Math.round((clampedValue / (SLIDER_WIDTH - THUMB_SIZE)) * 100);
      setDisplayPercent(percent);
    });
    return () => pan.removeListener(listenerId);
  }, [pan]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.extractOffset();
        // Light haptic on grab
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      },
      onPanResponderMove: (_, gestureState) => {
        let newX = gestureState.dx;
        pan.setValue(newX);
        
        // Calculate current percentage for haptic feedback
        // @ts-ignore
        const currentPanValue = Math.max(0, Math.min(pan._value + pan._offset, SLIDER_WIDTH - THUMB_SIZE));
        const currentPercent = Math.round((currentPanValue / (SLIDER_WIDTH - THUMB_SIZE)) * 100);
        
        // Trigger subtle haptic every 10% change
        if (Math.abs(currentPercent - lastHapticPercent.current) >= 10) {
          Haptics.selectionAsync();
          lastHapticPercent.current = currentPercent;
        }
      },
      onPanResponderRelease: () => {
        pan.flattenOffset();
        
        // @ts-ignore
        let currentValue = pan._value;
        currentValue = Math.max(0, Math.min(currentValue, SLIDER_WIDTH - THUMB_SIZE));
        
        const newValue = currentValue / (SLIDER_WIDTH - THUMB_SIZE);
        setSliderValue(newValue);
        onValueChange(newValue);
        lastHapticPercent.current = Math.round(newValue * 100);
        
        // Subtle confirmation haptic on release
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        
        Animated.spring(pan, {
          toValue: currentValue,
          useNativeDriver: false,
          tension: 50,
          friction: 7,
        }).start();
      },
    })
  ).current;

  const clampedPosition = pan.interpolate({
    inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
    outputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
    extrapolate: 'clamp',
  });

  const progressWidth = pan.interpolate({
    inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
    outputRange: [THUMB_SIZE / 2, SLIDER_WIDTH - THUMB_SIZE / 2],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.container, { opacity: opacityAnim, transform: [{ translateY: translateYAnim }, { scale: scaleAnim }] }]}>
      {/* Percentage label above slider */}
      <View style={styles.percentContainer}>
        <Animated.View style={[styles.percentBubble, { transform: [{ translateX: clampedPosition }] }]}>
          <Text style={styles.percentText}>{displayPercent}%</Text>
        </Animated.View>
      </View>
      
      <View style={styles.sliderContainer}>
        <View style={styles.track} />
        <Animated.View style={[styles.progress, { width: progressWidth }]} />
        <Animated.View
          style={[styles.thumb, { transform: [{ translateX: clampedPosition }] }]}
          {...panResponder.panHandlers}
        />
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>{minLabel}</Text>
        <Text style={styles.label}>{maxLabel}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 40,
  },
  percentContainer: {
    width: SLIDER_WIDTH,
    alignSelf: 'center',
    height: 40,
    marginBottom: 8,
  },
  percentBubble: {
    position: 'absolute',
    width: THUMB_SIZE + 24,
    marginLeft: -12,
    alignItems: 'center',
  },
  percentText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: 40,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  track: {
    position: 'absolute',
    width: '100%',
    height: 8,
    backgroundColor: Colors.progressBackground,
    borderRadius: 4,
  },
  progress: {
    position: 'absolute',
    height: 8,
    backgroundColor: Colors.selectedCard,
    borderRadius: 4,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.selectedCard,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    paddingHorizontal: 4,
  },
  label: {
    fontSize: 15,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
});
