import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ONBOARDING_KEY = '@bible_ai_onboarding_completed';
const ONBOARDING_DATA_KEY = '@bible_ai_onboarding_data';

interface OnboardingData {
  gender?: string;
  faithRelationship?: string;
  temptationStruggle?: string;
  trustLevel?: string;
  purposeClarity?: string;
  prayerFrequency?: string;
  bibleReadingHabit?: string;
  spiritualGoals?: string[];
  disciplineAreas?: string[];
  communityConnection?: string;
  gratitudePractice?: string;
  forgivenessJourney?: string;
  hopeLevel?: string;
  commitmentLevel?: string;
}

interface OnboardingContextType {
  hasCompletedOnboarding: boolean | null;
  onboardingData: OnboardingData;
  isLoading: boolean;
  updateOnboardingData: (key: keyof OnboardingData, value: any) => void;
  completeOnboarding: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export function OnboardingProvider({ children }: { children: ReactNode }) {
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState<boolean | null>(null);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadOnboardingState();
  }, []);

  const loadOnboardingState = async () => {
    try {
      const [completed, data] = await Promise.all([
        AsyncStorage.getItem(ONBOARDING_KEY),
        AsyncStorage.getItem(ONBOARDING_DATA_KEY),
      ]);
      
      setHasCompletedOnboarding(completed === 'true');
      if (data) {
        setOnboardingData(JSON.parse(data));
      }
    } catch (error) {
      console.error('Error loading onboarding state:', error);
      setHasCompletedOnboarding(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateOnboardingData = (key: keyof OnboardingData, value: any) => {
    setOnboardingData(prev => ({ ...prev, [key]: value }));
  };

  const completeOnboarding = async () => {
    try {
      await Promise.all([
        AsyncStorage.setItem(ONBOARDING_KEY, 'true'),
        AsyncStorage.setItem(ONBOARDING_DATA_KEY, JSON.stringify(onboardingData)),
      ]);
      setHasCompletedOnboarding(true);
    } catch (error) {
      console.error('Error saving onboarding state:', error);
    }
  };

  const resetOnboarding = async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(ONBOARDING_KEY),
        AsyncStorage.removeItem(ONBOARDING_DATA_KEY),
      ]);
      setHasCompletedOnboarding(false);
      setOnboardingData({});
    } catch (error) {
      console.error('Error resetting onboarding:', error);
    }
  };

  return (
    <OnboardingContext.Provider
      value={{
        hasCompletedOnboarding,
        onboardingData,
        isLoading,
        updateOnboardingData,
        completeOnboarding,
        resetOnboarding,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
}

export function useOnboarding() {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}
