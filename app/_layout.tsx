import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from '../context/OnboardingContext';
import { BookmarkProvider } from '../context/BookmarkContext';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <BookmarkProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </BookmarkProvider>
    </OnboardingProvider>
  );
}
