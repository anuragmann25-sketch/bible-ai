import React, { useRef, useEffect, useState, useCallback, useMemo, memo } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Animated, 
  Easing, 
  Dimensions, 
  ScrollView, 
  NativeSyntheticEvent, 
  NativeScrollEvent,
  Platform,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
] as const;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - 10 - i);
const DAYS_31 = Array.from({ length: 31 }, (_, i) => i + 1);

const DAYS_ARRAYS: Record<number, number[]> = {
  28: Array.from({ length: 28 }, (_, i) => i + 1),
  29: Array.from({ length: 29 }, (_, i) => i + 1),
  30: Array.from({ length: 30 }, (_, i) => i + 1),
  31: DAYS_31,
};

interface WheelColumnProps {
  data: readonly (string | number)[];
  initialIndex: number;
  onSelectEnd: (index: number) => void;
  width: number;
}

const WheelColumn = memo(({ 
  data, 
  initialIndex, 
  onSelectEnd,
  width,
}: WheelColumnProps) => {
  const scrollViewRef = useRef<ScrollView>(null);
  const isUserScrolling = useRef(false);
  const lastHapticIndex = useRef(-1);
  const currentScrollIndex = useRef(initialIndex);
  
  useEffect(() => {
    if (!isUserScrolling.current && scrollViewRef.current) {
      currentScrollIndex.current = initialIndex;
      scrollViewRef.current.scrollTo({
        y: initialIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [initialIndex]);

  const triggerHaptic = useCallback(() => {
    if (Platform.OS === 'ios') {
      Haptics.selectionAsync();
    }
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    
    currentScrollIndex.current = clampedIndex;
    
    if (clampedIndex !== lastHapticIndex.current) {
      lastHapticIndex.current = clampedIndex;
      triggerHaptic();
    }
  }, [data.length, triggerHaptic]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    
    isUserScrolling.current = false;
    
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
    
    if (clampedIndex !== initialIndex) {
      onSelectEnd(clampedIndex);
    }
  }, [data.length, initialIndex, onSelectEnd]);

  const handleScrollBegin = useCallback(() => {
    isUserScrolling.current = true;
  }, []);

  const handleScrollEndDrag = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const velocity = event.nativeEvent.velocity?.y || 0;
    if (Math.abs(velocity) < 0.5) {
      handleScrollEnd(event);
    }
  }, [handleScrollEnd]);

  const renderedItems = useMemo(() => {
    return data.map((item, index) => (
      <View key={`${item}-${index}`} style={styles.itemContainer}>
        <Text style={[
          styles.itemText,
          index === initialIndex && styles.itemTextSelected,
        ]}>
          {String(item)}
        </Text>
      </View>
    ));
  }, [data, initialIndex]);

  return (
    <View style={[styles.columnContainer, { width }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        scrollEventThrottle={32}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEndDrag}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.topPadding} />
        {renderedItems}
        <View style={styles.bottomPadding} />
      </ScrollView>
      <View style={styles.selectionIndicator} pointerEvents="none" />
    </View>
  );
});

interface DatePickerWheelProps {
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

export function DatePickerWheel({ onDateChange, initialDate }: DatePickerWheelProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(14)).current;
  const onDateChangeRef = useRef(onDateChange);
  const hasCalledInitial = useRef(false);
  
  onDateChangeRef.current = onDateChange;
  
  const defaultDate = initialDate || new Date(2000, 0, 1);
  
  const [selectedMonth, setSelectedMonth] = useState(defaultDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(defaultDate.getDate() - 1);
  const [selectedYearIndex, setSelectedYearIndex] = useState(() => {
    const index = YEARS.findIndex(y => y === defaultDate.getFullYear());
    return index !== -1 ? index : 24;
  });

  const daysInMonth = useMemo(() => {
    const year = YEARS[selectedYearIndex];
    return new Date(year, selectedMonth + 1, 0).getDate();
  }, [selectedYearIndex, selectedMonth]);

  const availableDays = useMemo(() => {
    return DAYS_ARRAYS[daysInMonth] || DAYS_31;
  }, [daysInMonth]);

  const clampedDay = useMemo(() => {
    return Math.min(selectedDay, daysInMonth - 1);
  }, [selectedDay, daysInMonth]);

  useEffect(() => {
    // Reset for clean replay on navigation
    fadeAnim.setValue(0);
    translateYAnim.setValue(14);
    
    // Calm, intentional animation with initial delay
    const delay = 180;
    const duration = 380;
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
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

  useEffect(() => {
    const year = YEARS[selectedYearIndex];
    const month = selectedMonth;
    const day = clampedDay + 1;
    const date = new Date(year, month, day);
    
    onDateChangeRef.current(date);
    hasCalledInitial.current = true;
  }, [selectedYearIndex, selectedMonth, clampedDay]);

  const handleMonthSelect = useCallback((index: number) => {
    setSelectedMonth(index);
  }, []);

  const handleDaySelect = useCallback((index: number) => {
    setSelectedDay(index);
  }, []);

  const handleYearSelect = useCallback((index: number) => {
    setSelectedYearIndex(index);
  }, []);

  const columnWidth = (SCREEN_WIDTH - 48) / 3;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim, transform: [{ translateY: translateYAnim }] }]}>
      <View style={styles.pickerRow}>
        <WheelColumn
          data={MONTHS}
          initialIndex={selectedMonth}
          onSelectEnd={handleMonthSelect}
          width={columnWidth}
        />
        <WheelColumn
          data={availableDays}
          initialIndex={clampedDay}
          onSelectEnd={handleDaySelect}
          width={columnWidth * 0.6}
        />
        <WheelColumn
          data={YEARS}
          initialIndex={selectedYearIndex}
          onSelectEnd={handleYearSelect}
          width={columnWidth}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pickerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: PICKER_HEIGHT,
  },
  columnContainer: {
    height: PICKER_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
  },
  scrollContent: {
    alignItems: 'center',
  },
  topPadding: {
    height: ITEM_HEIGHT * 2,
  },
  bottomPadding: {
    height: ITEM_HEIGHT * 2,
  },
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 20,
    color: Colors.textMuted,
    fontWeight: '400',
  },
  itemTextSelected: {
    color: Colors.text,
    fontWeight: '600',
    fontSize: 22,
  },
  selectionIndicator: {
    position: 'absolute',
    top: ITEM_HEIGHT * 2,
    left: 8,
    right: 8,
    height: ITEM_HEIGHT,
    backgroundColor: Colors.unselectedCard,
    borderRadius: 10,
    zIndex: -1,
  },
});
