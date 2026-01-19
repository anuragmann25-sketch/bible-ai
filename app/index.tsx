import { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Easing, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SplashScreen from 'expo-splash-screen';

const { width, height } = Dimensions.get('window');
const ONBOARDING_KEY = '@bible_ai_onboarding_completed';
const SPLASH_DURATION = 1000;

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const hasNavigated = useRef(false);
  const [appIsReady, setAppIsReady] = useState(false);
  const [shouldNavigateTo, setShouldNavigateTo] = useState<'onboarding' | 'home' | null>(null);
  
  const screenFadeAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const prepare = async () => {
      try {
        const completed = await AsyncStorage.getItem(ONBOARDING_KEY);
        setShouldNavigateTo(completed === 'true' ? 'home' : 'onboarding');
      } catch (error) {
        console.error('Error checking onboarding:', error);
        setShouldNavigateTo('onboarding');
      } finally {
        setAppIsReady(true);
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (appIsReady && shouldNavigateTo) {
      const animateSplash = async () => {
        // Hide native splash screen
        await SplashScreen.hideAsync();

        // Wait for splash duration then navigate with smooth fade
        setTimeout(() => {
          Animated.timing(screenFadeAnim, {
            toValue: 0,
            duration: 400,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }).start(() => {
            if (!hasNavigated.current) {
              hasNavigated.current = true;
              if (shouldNavigateTo === 'home') {
                router.replace('/(tabs)');
              } else {
                router.replace('/onboarding');
              }
            }
          });
        }, SPLASH_DURATION);
      };

      animateSplash();
    }
  }, [appIsReady, shouldNavigateTo]);

  return (
    <Animated.View style={[styles.container, { opacity: screenFadeAnim }]}>
      <Image
        source={require('../assets/splash-crucifix.png')}
        style={styles.splashImage}
        resizeMode="contain"
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  splashImage: {
    width: width * 0.5,
    height: height * 0.5,
    marginTop: -60,
  },
});
