import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Colors } from '../../constants/colors';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const progress = (currentStep / totalSteps) * 100;
    Animated.timing(animatedWidth, {
      toValue: progress,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.progress,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 100],
              outputRange: ['0%', '100%'],
            }),
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: 6,
    backgroundColor: Colors.progressBackground,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progress: {
    height: '100%',
    backgroundColor: Colors.selectedCard,
    borderRadius: 3,
  },
});
