import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';

interface OptionCardProps {
  label: string;
  sublabel?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  selected: boolean;
  onPress: () => void;
  index?: number;
}

export function OptionCard({ label, sublabel, icon, selected, onPress, index = 0 }: OptionCardProps) {
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(14)).current;
  const selectedAnim = useRef(new Animated.Value(0)).current;

  const handlePress = () => {
    // Very subtle selection haptic
    Haptics.selectionAsync();
    onPress();
  };

  useEffect(() => {
    // Reset animations for clean replay on navigation
    opacityAnim.setValue(0);
    translateYAnim.setValue(14);
    
    // Staggered animation timing - calm and intentional
    const initialDelay = 150; // Delay before first option
    const staggerDelay = 100; // Delay between each option
    const animationDuration = 350; // Duration per option
    const delay = initialDelay + (index * staggerDelay);
    
    Animated.parallel([
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: animationDuration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 0,
        duration: animationDuration,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [index]);

  useEffect(() => {
    Animated.timing(selectedAnim, {
      toValue: selected ? 1 : 0,
      duration: 200,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const selectedScale = selectedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.015],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: opacityAnim,
          transform: [{ translateY: translateYAnim }, { scale: selectedScale }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        {icon && (
          <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
            <Ionicons
              name={icon}
              size={24}
              color={selected ? Colors.white : Colors.text}
            />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
          {sublabel && (
            <Text style={[styles.sublabel, selected && styles.sublabelSelected]}>{sublabel}</Text>
          )}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.unselectedCard,
    borderRadius: 16,
    padding: 18,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  cardSelected: {
    backgroundColor: Colors.selectedCard,
    borderColor: Colors.selectedCard,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconContainerSelected: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    letterSpacing: -0.3,
  },
  labelSelected: {
    color: Colors.white,
  },
  sublabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  sublabelSelected: {
    color: 'rgba(255,255,255,0.7)',
  },
});
