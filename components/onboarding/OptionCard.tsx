import React, { useEffect, useRef } from 'react';
import { TouchableOpacity, Text, View, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
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
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const selectedAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const delay = index * 60;
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 350,
        delay,
        easing: Easing.out(Easing.back(1.2)),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        delay,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  useEffect(() => {
    Animated.spring(selectedAnim, {
      toValue: selected ? 1 : 0,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, [selected]);

  const selectedScale = selectedAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.02],
  });

  return (
    <Animated.View
      style={[
        styles.wrapper,
        {
          opacity: opacityAnim,
          transform: [{ scale: scaleAnim }, { scale: selectedScale }],
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={onPress}
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
