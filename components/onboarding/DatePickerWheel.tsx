import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, Animated, Easing, Dimensions, ScrollView, NativeSyntheticEvent, NativeScrollEvent } from 'react-native';
import { Colors } from '../../constants/colors';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const ITEM_HEIGHT = 44;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => currentYear - 10 - i);
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);

interface DatePickerWheelProps {
  onDateChange: (date: Date) => void;
  initialDate?: Date;
}

function WheelColumn({ 
  data, 
  selectedIndex, 
  onSelect, 
  formatItem,
  width,
}: { 
  data: (string | number)[]; 
  selectedIndex: number; 
  onSelect: (index: number) => void;
  formatItem?: (item: string | number) => string;
  width: number;
}) {
  const scrollViewRef = useRef<ScrollView>(null);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    if (!isScrolling && scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        y: selectedIndex * ITEM_HEIGHT,
        animated: false,
      });
    }
  }, [selectedIndex, isScrolling]);

  const handleScrollEnd = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / ITEM_HEIGHT);
    const clampedIndex = Math.max(0, Math.min(index, data.length - 1));
    
    if (clampedIndex !== selectedIndex) {
      onSelect(clampedIndex);
    }
    
    // Snap to position
    scrollViewRef.current?.scrollTo({
      y: clampedIndex * ITEM_HEIGHT,
      animated: true,
    });
    setIsScrolling(false);
  }, [data.length, selectedIndex, onSelect]);

  const handleScrollBegin = useCallback(() => {
    setIsScrolling(true);
  }, []);

  return (
    <View style={[styles.columnContainer, { width }]}>
      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        onScrollBeginDrag={handleScrollBegin}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={(event) => {
          // If momentum doesn't kick in, handle end here
          const velocity = event.nativeEvent.velocity?.y || 0;
          if (Math.abs(velocity) < 0.5) {
            handleScrollEnd(event);
          }
        }}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top padding */}
        <View style={{ height: ITEM_HEIGHT * 2 }} />
        
        {data.map((item, index) => {
          const isSelected = index === selectedIndex;
          const distance = Math.abs(index - selectedIndex);
          const opacity = distance === 0 ? 1 : distance === 1 ? 0.5 : 0.3;
          
          return (
            <View key={index} style={styles.itemContainer}>
              <Text style={[
                styles.itemText,
                isSelected && styles.itemTextSelected,
                { opacity }
              ]}>
                {formatItem ? formatItem(item) : String(item)}
              </Text>
            </View>
          );
        })}
        
        {/* Bottom padding */}
        <View style={{ height: ITEM_HEIGHT * 2 }} />
      </ScrollView>
      
      {/* Selection indicator */}
      <View style={styles.selectionIndicator} pointerEvents="none" />
    </View>
  );
}

export function DatePickerWheel({ onDateChange, initialDate }: DatePickerWheelProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const isFirstRender = useRef(true);
  const lastDateRef = useRef<string>('');
  const onDateChangeRef = useRef(onDateChange);
  
  // Keep callback ref updated
  onDateChangeRef.current = onDateChange;
  
  const defaultDate = initialDate || new Date(2000, 0, 1);
  const [selectedMonth, setSelectedMonth] = useState(defaultDate.getMonth());
  const [selectedDay, setSelectedDay] = useState(defaultDate.getDate() - 1);
  const [selectedYear, setSelectedYear] = useState(() => {
    const index = YEARS.findIndex(y => y === defaultDate.getFullYear());
    return index !== -1 ? index : 24; // Default to ~2000
  });

  // Calculate days in month as derived state
  const daysInMonth = useMemo(() => {
    return new Date(YEARS[selectedYear], selectedMonth + 1, 0).getDate();
  }, [selectedYear, selectedMonth]);

  // Clamp day to valid range (derived)
  const clampedDay = useMemo(() => {
    return Math.min(selectedDay, daysInMonth - 1);
  }, [selectedDay, daysInMonth]);

  const availableDays = useMemo(() => DAYS.slice(0, daysInMonth), [daysInMonth]);

  // Fade in animation - run once
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 400,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, []);

  // Notify parent of date changes - skip first render to prevent loop
  useEffect(() => {
    // Skip the very first render to prevent immediate state update
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    
    const year = YEARS[selectedYear];
    const month = selectedMonth;
    const day = clampedDay + 1;
    
    const dateString = `${year}-${month}-${day}`;
    
    // Only call onDateChange if the date actually changed
    if (dateString !== lastDateRef.current) {
      lastDateRef.current = dateString;
      const date = new Date(year, month, day);
      onDateChangeRef.current(date);
    }
  }, [selectedMonth, clampedDay, selectedYear]); // Removed onDateChange from deps

  // Sync selectedDay if it exceeds available days (only when needed)
  useEffect(() => {
    if (selectedDay >= daysInMonth) {
      setSelectedDay(daysInMonth - 1);
    }
  }, [daysInMonth]); // Intentionally exclude selectedDay to prevent loop

  const columnWidth = (SCREEN_WIDTH - 48) / 3;

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <View style={styles.pickerRow}>
        <WheelColumn
          data={MONTHS}
          selectedIndex={selectedMonth}
          onSelect={setSelectedMonth}
          width={columnWidth}
        />
        <WheelColumn
          data={availableDays}
          selectedIndex={clampedDay}
          onSelect={setSelectedDay}
          width={columnWidth * 0.6}
        />
        <WheelColumn
          data={YEARS}
          selectedIndex={selectedYear}
          onSelect={setSelectedYear}
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
