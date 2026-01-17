import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 80;
const CHART_HEIGHT = 180;

export function VisionChart() {
  const pathAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(pathAnim, {
        toValue: 1,
        duration: 1500,
        delay: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }),
    ]).start();
  }, []);

  // Points for spiritual growth curve
  const points = [
    { x: 0, y: 0.3 },
    { x: 0.2, y: 0.35 },
    { x: 0.4, y: 0.5 },
    { x: 0.6, y: 0.65 },
    { x: 0.8, y: 0.85 },
    { x: 1, y: 0.95 },
  ];

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Your Spiritual Journey</Text>
        
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>Strong</Text>
          <Text style={styles.axisLabel}>Growing</Text>
          <Text style={styles.axisLabel}>Starting</Text>
        </View>

        {/* Chart area */}
        <View style={styles.chart}>
          {/* Grid lines */}
          <View style={[styles.gridLine, { top: '25%' }]} />
          <View style={[styles.gridLine, { top: '50%' }]} />
          <View style={[styles.gridLine, { top: '75%' }]} />

          {/* Growth curve (simplified with dots and lines) */}
          {points.map((point, index) => {
            const scale = pathAnim.interpolate({
              inputRange: [0, (index + 1) / points.length, 1],
              outputRange: [0, 1, 1],
              extrapolate: 'clamp',
            });
            
            return (
              <Animated.View
                key={index}
                style={[
                  styles.point,
                  {
                    left: `${point.x * 100}%`,
                    bottom: `${point.y * 100}%`,
                    transform: [{ scale }],
                  },
                ]}
              />
            );
          })}

          {/* Connecting line segments */}
          {points.slice(0, -1).map((point, index) => {
            const nextPoint = points[index + 1];
            const dx = (nextPoint.x - point.x) * CHART_WIDTH * 0.85;
            const dy = (nextPoint.y - point.y) * CHART_HEIGHT;
            const length = Math.sqrt(dx * dx + dy * dy);
            const angle = Math.atan2(-dy, dx) * (180 / Math.PI);
            
            const opacity = pathAnim.interpolate({
              inputRange: [index / points.length, (index + 1) / points.length],
              outputRange: [0, 1],
              extrapolate: 'clamp',
            });

            return (
              <Animated.View
                key={`line-${index}`}
                style={[
                  styles.line,
                  {
                    left: `${point.x * 100}%`,
                    bottom: `${point.y * 100}%`,
                    width: length,
                    transform: [{ rotate: `${angle}deg` }],
                    opacity,
                  },
                ]}
              />
            );
          })}

          {/* Highlight area */}
          <Animated.View 
            style={[
              styles.highlightArea,
              {
                opacity: pathAnim.interpolate({
                  inputRange: [0.5, 1],
                  outputRange: [0, 0.15],
                }),
              },
            ]} 
          />
        </View>

        {/* X-axis labels */}
        <View style={styles.xAxis}>
          <Text style={styles.axisLabel}>Week 1</Text>
          <Text style={styles.axisLabel}>Week 4</Text>
          <Text style={styles.axisLabel}>Month 3</Text>
        </View>
      </View>

      <Text style={styles.caption}>
        80% of users report feeling spiritually stronger after 30 days of consistent practice
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  chartContainer: {
    backgroundColor: Colors.cardBackground,
    borderRadius: 20,
    padding: 20,
    width: CHART_WIDTH + 40,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
    letterSpacing: -0.3,
  },
  yAxis: {
    position: 'absolute',
    left: 20,
    top: 60,
    height: CHART_HEIGHT,
    justifyContent: 'space-between',
  },
  chart: {
    height: CHART_HEIGHT,
    marginLeft: 60,
    marginRight: 10,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: Colors.progressBackground,
  },
  point: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
    marginLeft: -6,
    marginBottom: -6,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  line: {
    position: 'absolute',
    height: 3,
    backgroundColor: Colors.primary,
    transformOrigin: 'left center',
    borderRadius: 1.5,
  },
  highlightArea: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: '40%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  xAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 60,
    marginRight: 10,
    marginTop: 12,
  },
  axisLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  caption: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 20,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
});
