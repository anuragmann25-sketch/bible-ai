import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BAR_WIDTH = SCREEN_WIDTH - 80;

interface LoadingScreenProps {
  onComplete: () => void;
}

const STEPS = [
  'Analyzing your spiritual profile...',
  'Preparing personalized guidance...',
  'Setting up daily devotions...',
  'Customizing your experience...',
  'Finalizing your spiritual path...',
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [percentage, setPercentage] = useState(0);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const progressAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const stepFadeAnim = useRef(new Animated.Value(1)).current;
  const checkmarkAnims = STEPS.map(() => useRef(new Animated.Value(0)).current);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Animate progress
    const duration = 4000;
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = Easing.out(Easing.cubic)(progress);
      
      setPercentage(Math.round(easedProgress * 100));
      
      // Update step index
      const newStepIndex = Math.min(Math.floor(easedProgress * STEPS.length), STEPS.length - 1);
      if (newStepIndex !== currentStepIndex) {
        // Animate checkmark for completed step
        Animated.timing(checkmarkAnims[currentStepIndex], {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }).start();
        
        setCurrentStepIndex(newStepIndex);
      }

      if (progress >= 1) {
        clearInterval(interval);
        // Animate final checkmark
        Animated.timing(checkmarkAnims[STEPS.length - 1], {
          toValue: 1,
          duration: 300,
          easing: Easing.out(Easing.back(2)),
          useNativeDriver: true,
        }).start();
        
        setTimeout(onComplete, 800);
      }
    }, 50);

    // Animate progress bar
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    return () => clearInterval(interval);
  }, []);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, BAR_WIDTH],
  });

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.percentage}>{percentage}%</Text>
        <Text style={styles.title}>Preparing your{'\n'}spiritual journey</Text>

        {/* Progress bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, { width: progressWidth }]}>
              <View style={styles.progressGradient} />
            </Animated.View>
          </View>
        </View>

        <Text style={styles.currentStep}>{STEPS[currentStepIndex]}</Text>

        {/* Step checklist */}
        <View style={styles.stepsContainer}>
          <Text style={styles.stepsTitle}>Setting up for you</Text>
          {STEPS.map((step, index) => {
            const isCompleted = index < currentStepIndex || percentage === 100;
            const scale = checkmarkAnims[index].interpolate({
              inputRange: [0, 1],
              outputRange: [0.5, 1],
            });
            
            return (
              <View key={index} style={styles.stepRow}>
                <View style={styles.stepBullet}>
                  {isCompleted ? (
                    <Animated.View style={{ transform: [{ scale }] }}>
                      <Text style={styles.checkmark}>✓</Text>
                    </Animated.View>
                  ) : index === currentStepIndex ? (
                    <View style={styles.activeDot} />
                  ) : (
                    <View style={styles.inactiveDot} />
                  )}
                </View>
                <Text style={[
                  styles.stepText,
                  isCompleted && styles.stepTextCompleted,
                  index === currentStepIndex && styles.stepTextActive,
                ]}>
                  {step.replace('...', '')}
                </Text>
              </View>
            );
          })}
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 40,
  },
  percentage: {
    fontSize: 72,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -3,
    fontVariant: ['tabular-nums'],
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 40,
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  progressContainer: {
    width: BAR_WIDTH,
    marginBottom: 24,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Colors.progressBackground,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressGradient: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  currentStep: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 48,
  },
  stepsContainer: {
    width: '100%',
    alignItems: 'flex-start',
  },
  stepsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 20,
    letterSpacing: -0.3,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  stepBullet: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  checkmark: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primary,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  inactiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.progressBackground,
  },
  stepText: {
    fontSize: 15,
    color: Colors.textMuted,
    flex: 1,
  },
  stepTextCompleted: {
    color: Colors.text,
  },
  stepTextActive: {
    color: Colors.text,
    fontWeight: '500',
  },
});
