import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Easing, PanResponder, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SLIDER_WIDTH = SCREEN_WIDTH - 80;
const THUMB_SIZE = 28;

interface SliderOptionProps {
  value: number;
  onValueChange: (value: number) => void;
  minLabel?: string;
  maxLabel?: string;
  label?: string;
}

export function SliderOption({
  value,
  onValueChange,
  minLabel = 'Low',
  maxLabel = 'High',
  label,
}: SliderOptionProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(value * (SLIDER_WIDTH - THUMB_SIZE))).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  useEffect(() => {
    translateX.setValue(value * (SLIDER_WIDTH - THUMB_SIZE));
  }, [value]);

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gestureState) => {
      const newX = Math.max(0, Math.min(gestureState.moveX - 40, SLIDER_WIDTH - THUMB_SIZE));
      translateX.setValue(newX);
      const newValue = newX / (SLIDER_WIDTH - THUMB_SIZE);
      onValueChange(Math.round(newValue * 10) / 10);
    },
    onPanResponderRelease: () => {},
  });

  const fillWidth = translateX.interpolate({
    inputRange: [0, SLIDER_WIDTH - THUMB_SIZE],
    outputRange: [THUMB_SIZE / 2, SLIDER_WIDTH - THUMB_SIZE / 2],
  });

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <Text style={styles.valueText}>{Math.round(value * 100)}%</Text>
      <View style={styles.sliderContainer}>
        <View style={styles.track}>
          <Animated.View style={[styles.fill, { width: fillWidth }]} />
        </View>
        <Animated.View
          style={[styles.thumb, { transform: [{ translateX }] }]}
          {...panResponder.panHandlers}
        />
      </View>
      <View style={styles.labelRow}>
        <Text style={styles.minMaxLabel}>{minLabel}</Text>
        <Text style={styles.minMaxLabel}>{maxLabel}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  label: {
    fontSize: 17,
    color: Colors.textSecondary,
    marginBottom: 16,
  },
  valueText: {
    fontSize: 48,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 40,
    letterSpacing: -1,
  },
  sliderContainer: {
    width: SLIDER_WIDTH,
    height: 40,
    justifyContent: 'center',
  },
  track: {
    height: 6,
    backgroundColor: Colors.progressBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  thumb: {
    position: 'absolute',
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: THUMB_SIZE / 2,
    backgroundColor: Colors.text,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: SLIDER_WIDTH,
    marginTop: 12,
  },
  minMaxLabel: {
    fontSize: 14,
    color: Colors.textMuted,
  },
});
