import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { OnboardingProvider } from '../context/OnboardingContext';
import { BookmarkProvider } from '../context/BookmarkContext';
import { ChatProvider } from '../context/ChatContext';

export default function RootLayout() {
  return (
    <OnboardingProvider>
      <BookmarkProvider>
        <ChatProvider>
          <StatusBar style="dark" />
          <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
            <Stack.Screen name="index" />
            <Stack.Screen 
              name="onboarding" 
              options={{ 
                animation: 'fade',
                gestureEnabled: false,
              }} 
            />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </ChatProvider>
      </BookmarkProvider>
    </OnboardingProvider>
  );
}
