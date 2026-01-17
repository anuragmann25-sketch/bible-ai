import { useEffect, useRef } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import { Colors } from '../constants/colors';

export default function Index() {
  const router = useRouter();
  const { hasCompletedOnboarding, isLoading } = useOnboarding();
  const hasNavigated = useRef(false);

  useEffect(() => {
    // Fallback: if still loading after 3 seconds, go to onboarding
    const fallbackTimer = setTimeout(() => {
      if (!hasNavigated.current) {
        hasNavigated.current = true;
        console.log('Fallback navigation to onboarding');
        router.replace('/onboarding');
      }
    }, 3000);

    return () => clearTimeout(fallbackTimer);
  }, []);

  useEffect(() => {
    // Navigate once loading is complete
    if (!isLoading && !hasNavigated.current) {
      hasNavigated.current = true;
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.replace('/onboarding');
      }
    }
  }, [isLoading, hasCompletedOnboarding]);

  // Always render a visible loading screen
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.primary} />
      <Text style={styles.loadingText}>Loading...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFDF9',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.textMuted,
    fontWeight: '500',
  },
});
