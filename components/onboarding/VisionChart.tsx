import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from 'react-native';
import Svg, { Path, Circle, Defs, LinearGradient, Stop, Line, G } from 'react-native-svg';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CHART_WIDTH = SCREEN_WIDTH - 96;
const CHART_HEIGHT = 180;
const PADDING_LEFT = 20;
const PADDING_RIGHT = 20;
const PADDING_TOP = 20;
const PADDING_BOTTOM = 40;

const AnimatedG = Animated.createAnimatedComponent(G);

export function VisionChart() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const pathAnim = useRef(new Animated.Value(0)).current;
  const trophyAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Initial fade in
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();

    // Path draw animation
    Animated.timing(pathAnim, {
      toValue: 1,
      duration: 1500,
      delay: 300,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();

    // Trophy bounce
    Animated.spring(trophyAnim, {
      toValue: 1,
      delay: 1200,
      useNativeDriver: true,
      tension: 40,
      friction: 5,
    }).start();
  }, []);

  // Chart dimensions
  const chartW = CHART_WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const chartH = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  // Data points (normalized 0-1)
  const points = [
    { x: 0, y: 0.15 },      // Start low
    { x: 0.25, y: 0.25 },   // 3 days
    { x: 0.45, y: 0.45 },   // 7 days  
    { x: 0.70, y: 0.65 },   // Mid point
    { x: 1, y: 0.95 },      // 30 days - trophy
  ];

  // Convert to SVG coordinates (y is inverted)
  const toSvg = (p: { x: number; y: number }) => ({
    x: PADDING_LEFT + p.x * chartW,
    y: PADDING_TOP + (1 - p.y) * chartH,
  });

  const svgPoints = points.map(toSvg);

  // Create smooth bezier curve
  const createCurvePath = () => {
    const p = svgPoints;
    let path = `M ${p[0].x} ${p[0].y}`;
    
    for (let i = 0; i < p.length - 1; i++) {
      const curr = p[i];
      const next = p[i + 1];
      const cp1x = curr.x + (next.x - curr.x) * 0.5;
      const cp1y = curr.y;
      const cp2x = curr.x + (next.x - curr.x) * 0.5;
      const cp2y = next.y;
      path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    
    return path;
  };

  // Create filled area path
  const createFilledPath = () => {
    const curvePath = createCurvePath();
    const bottomY = PADDING_TOP + chartH;
    return `${curvePath} L ${svgPoints[svgPoints.length - 1].x} ${bottomY} L ${svgPoints[0].x} ${bottomY} Z`;
  };

  // Vertical zone positions
  const zone1X = PADDING_LEFT + chartW * 0.25;
  const zone2X = PADDING_LEFT + chartW * 0.50;
  const zone3X = PADDING_LEFT + chartW * 0.75;

  return (
    <Animated.View
      style={[
        styles.container,
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
      ]}
    >
      <View style={styles.chartCard}>
        <Text style={styles.chartTitle}>Your Spiritual Growth</Text>
        
        <View style={styles.chartContainer}>
          <Svg width={CHART_WIDTH} height={CHART_HEIGHT}>
            <Defs>
              {/* Gradient for fill area - peachy/warm tone like Cal AI */}
              <LinearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <Stop offset="0%" stopColor="#F5D5C0" stopOpacity="0.6" />
                <Stop offset="50%" stopColor="#FAE5D8" stopOpacity="0.3" />
                <Stop offset="100%" stopColor="#FFF8F4" stopOpacity="0.05" />
              </LinearGradient>
            </Defs>
            
            {/* Vertical shaded zones */}
            <Path
              d={`M ${zone1X} ${PADDING_TOP} L ${zone1X} ${PADDING_TOP + chartH} L ${zone2X} ${PADDING_TOP + chartH} L ${zone2X} ${PADDING_TOP} Z`}
              fill="#F8F8F8"
              opacity={0.7}
            />
            <Path
              d={`M ${zone2X} ${PADDING_TOP} L ${zone2X} ${PADDING_TOP + chartH} L ${zone3X} ${PADDING_TOP + chartH} L ${zone3X} ${PADDING_TOP} Z`}
              fill="#F5F5F5"
              opacity={0.5}
            />
            
            {/* Horizontal dashed guide lines */}
            <Line
              x1={PADDING_LEFT}
              y1={PADDING_TOP + chartH * 0.33}
              x2={PADDING_LEFT + chartW}
              y2={PADDING_TOP + chartH * 0.33}
              stroke="#E0E0E0"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            <Line
              x1={PADDING_LEFT}
              y1={PADDING_TOP + chartH * 0.66}
              x2={PADDING_LEFT + chartW}
              y2={PADDING_TOP + chartH * 0.66}
              stroke="#E0E0E0"
              strokeWidth={1}
              strokeDasharray="4 4"
            />
            
            {/* Filled area under curve */}
            <Path
              d={createFilledPath()}
              fill="url(#areaGradient)"
            />
            
            {/* Main curve line */}
            <Path
              d={createCurvePath()}
              stroke={Colors.text}
              strokeWidth={2.5}
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Data point dots */}
            {svgPoints.slice(0, 4).map((point, index) => (
              <G key={index}>
                <Circle
                  cx={point.x}
                  cy={point.y}
                  r={7}
                  fill={Colors.white}
                  stroke={Colors.text}
                  strokeWidth={2}
                />
              </G>
            ))}
            
            {/* Trophy circle background */}
            <Circle
              cx={svgPoints[4].x}
              cy={svgPoints[4].y}
              r={18}
              fill="#FAE0C8"
            />
          </Svg>
          
          {/* Trophy emoji overlay */}
          <Animated.View
            style={[
              styles.trophyContainer,
              {
                left: svgPoints[4].x - 18,
                top: svgPoints[4].y - 18,
                transform: [{ scale: trophyAnim }],
              },
            ]}
          >
            <Text style={styles.trophyEmoji}>🏆</Text>
          </Animated.View>
        </View>
        
        {/* Labels */}
        <View style={styles.labelsRow}>
          <Text style={styles.labelText}>3 Days</Text>
          <Text style={styles.labelText}>7 Days</Text>
          <Text style={styles.labelText}>30 Days</Text>
        </View>
        
        <Text style={styles.description}>
          Based on our data, growth builds momentum.{'\n'}After 30 days, you'll reach your goals faster!
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: -60,
  },
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.primaryBorder,
    padding: 24,
    width: SCREEN_WIDTH - 48,
  },
  chartTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  chartContainer: {
    width: CHART_WIDTH,
    height: CHART_HEIGHT,
    position: 'relative',
    alignSelf: 'center',
  },
  trophyContainer: {
    position: 'absolute',
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  trophyEmoji: {
    fontSize: 18,
  },
  labelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    marginTop: 8,
    marginBottom: 20,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
