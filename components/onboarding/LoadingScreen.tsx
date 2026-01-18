import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface LoadingScreenProps {
  onComplete: () => void;
}

interface ChecklistItem {
  label: string;
  delay: number;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  { label: 'Spiritual guidance', delay: 0 },
  { label: 'Daily verses', delay: 600 },
  { label: 'AI companion', delay: 1200 },
  { label: 'Personal journey', delay: 1800 },
  { label: 'Growth tracking', delay: 2400 },
];

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [displayPercent, setDisplayPercent] = useState(0);
  const [statusText, setStatusText] = useState('Preparing your personalized journey...');
  const [completedItems, setCompletedItems] = useState<number[]>([]);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const percentAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const checkAnims = useRef(CHECKLIST_ITEMS.map(() => new Animated.Value(0))).current;

  useEffect(() => {
    // Initial fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    // Smooth percentage counting
    Animated.timing(percentAnim, {
      toValue: 100,
      duration: 3500,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 100,
      duration: 3500,
      easing: Easing.inOut(Easing.cubic),
      useNativeDriver: false,
    }).start(() => {
      setTimeout(onComplete, 300);
    });

    // Listen to percentage changes
    const listenerId = percentAnim.addListener(({ value }) => {
      setDisplayPercent(Math.round(value));
      
      // Update status text based on progress
      if (value < 25) {
        setStatusText('Preparing your personalized journey...');
      } else if (value < 50) {
        setStatusText('Setting up your experience...');
      } else if (value < 75) {
        setStatusText('Customizing your content...');
      } else {
        setStatusText('Almost ready...');
      }
    });

    // Animate checklist items with staggered timing
    CHECKLIST_ITEMS.forEach((item, index) => {
      setTimeout(() => {
        Animated.spring(checkAnims[index], {
          toValue: 1,
          useNativeDriver: true,
          tension: 50,
          friction: 7,
        }).start();
        setCompletedItems(prev => [...prev, index]);
      }, item.delay);
    });

    return () => percentAnim.removeListener(listenerId);
  }, []);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      {/* Large percentage display */}
      <Text style={styles.percentText}>{displayPercent}%</Text>
      
      {/* Main heading */}
      <Text style={styles.heading}>We're setting up{'\n'}everything for you</Text>
      
      {/* Progress bar */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 100],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>
      
      {/* Status text */}
      <Text style={styles.statusText}>{statusText}</Text>
      
      {/* Checklist */}
      <View style={styles.checklistContainer}>
        <Text style={styles.checklistTitle}>Your personalized experience</Text>
        
        {CHECKLIST_ITEMS.map((item, index) => (
          <Animated.View
            key={index}
            style={[
              styles.checklistItem,
              {
                opacity: checkAnims[index],
                transform: [{
                  translateX: checkAnims[index].interpolate({
                    inputRange: [0, 1],
                    outputRange: [-20, 0],
                  }),
                }],
              },
            ]}
          >
            <View style={styles.bulletPoint} />
            <Text style={styles.checklistLabel}>{item.label}</Text>
            {completedItems.includes(index) && (
              <Animated.View
                style={[
                  styles.checkIcon,
                  {
                    transform: [{
                      scale: checkAnims[index],
                    }],
                  },
                ]}
              >
                <Ionicons name="checkmark-circle" size={22} color={Colors.text} />
              </Animated.View>
            )}
          </Animated.View>
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: 32,
  },
  percentText: {
    fontSize: 72,
    fontWeight: '300',
    color: Colors.text,
    letterSpacing: -2,
    marginBottom: 16,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 36,
    marginBottom: 32,
    letterSpacing: -0.5,
  },
  progressContainer: {
    width: SCREEN_WIDTH - 64,
    height: 8,
    backgroundColor: Colors.progressBackground,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: Colors.text,
  },
  statusText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 48,
  },
  checklistContainer: {
    width: SCREEN_WIDTH - 64,
    alignItems: 'flex-start',
  },
  checklistTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  checklistItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textSecondary,
    marginRight: 12,
  },
  checklistLabel: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
  },
  checkIcon: {
    marginLeft: 8,
  },
});
