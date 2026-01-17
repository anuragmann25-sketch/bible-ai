import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useOnboarding, OnboardingData } from '../context/OnboardingContext';
import { Colors } from '../constants/colors';
import {
  OnboardingLayout,
  OptionCard,
  SliderOption,
  VisionChart,
  LoadingScreen,
  DatePickerWheel,
} from '../components/onboarding';

const TOTAL_STEPS = 14;

type StepConfig = {
  title: string;
  subtitle?: string;
  type: 'single' | 'slider' | 'vision' | 'datepicker';
  dataKey?: keyof OnboardingData;
  options?: Array<{
    value: string;
    label: string;
    sublabel?: string;
    icon?: string;
  }>;
};

const STEPS: StepConfig[] = [
  // Step 1: Gender
  {
    title: 'What is your gender?',
    subtitle: 'This helps us personalize your spiritual guidance.',
    type: 'single',
    dataKey: 'gender',
    options: [
      { value: 'male', label: 'Male', icon: 'man-outline' },
      { value: 'female', label: 'Female', icon: 'woman-outline' },
    ],
  },
  // Step 2: Birth Date
  {
    title: 'When were you born?',
    subtitle: 'This helps us personalize your spiritual guidance.',
    type: 'datepicker',
    dataKey: 'birthDate',
  },
  // Step 3: Spiritual State
  {
    title: 'How would you describe your current spiritual state?',
    subtitle: 'Be honest - there\'s no judgment here.',
    type: 'single',
    dataKey: 'spiritualState',
    options: [
      { value: 'lost', label: 'Lost', sublabel: 'Searching for direction', icon: 'compass-outline' },
      { value: 'searching', label: 'Searching', sublabel: 'Exploring my faith', icon: 'search-outline' },
      { value: 'returning', label: 'Returning', sublabel: 'Coming back to God', icon: 'return-up-forward-outline' },
      { value: 'strong', label: 'Strong', sublabel: 'Growing deeper', icon: 'shield-checkmark-outline' },
    ],
  },
  // Step 4: Prayer Frequency
  {
    title: 'How often do you pray or reflect?',
    subtitle: 'Understanding your current habits helps us guide you.',
    type: 'single',
    dataKey: 'prayerFrequency',
    options: [
      { value: 'rarely', label: 'Rarely', sublabel: 'A few times a year', icon: 'time-outline' },
      { value: 'sometimes', label: 'Sometimes', sublabel: 'A few times a month', icon: 'calendar-outline' },
      { value: 'often', label: 'Often', sublabel: 'Several times a week', icon: 'repeat-outline' },
      { value: 'daily', label: 'Daily', sublabel: 'Every day', icon: 'sunny-outline' },
    ],
  },
  // Step 5: Biggest Struggle
  {
    title: 'What is your biggest current struggle?',
    subtitle: 'We all face challenges. Let us help you overcome.',
    type: 'single',
    dataKey: 'biggestStruggle',
    options: [
      { value: 'temptation', label: 'Temptation', icon: 'flame-outline' },
      { value: 'doubt', label: 'Doubt', icon: 'help-circle-outline' },
      { value: 'fear', label: 'Fear', icon: 'warning-outline' },
      { value: 'lust', label: 'Lust', icon: 'heart-dislike-outline' },
      { value: 'anxiety', label: 'Anxiety', icon: 'pulse-outline' },
      { value: 'loneliness', label: 'Loneliness', icon: 'person-outline' },
    ],
  },
  // Step 6: Current Struggle Detail
  {
    title: 'What do you struggle with most right now?',
    subtitle: 'Select the one that resonates most deeply.',
    type: 'single',
    dataKey: 'currentStruggle',
    options: [
      { value: 'anger', label: 'Anger', sublabel: 'Managing emotions', icon: 'thunderstorm-outline' },
      { value: 'pride', label: 'Pride', sublabel: 'Humility struggles', icon: 'ribbon-outline' },
      { value: 'laziness', label: 'Laziness', sublabel: 'Lack of motivation', icon: 'bed-outline' },
      { value: 'envy', label: 'Envy', sublabel: 'Comparing to others', icon: 'eye-outline' },
      { value: 'greed', label: 'Greed', sublabel: 'Material attachment', icon: 'cash-outline' },
    ],
  },
  // Step 7: Feeling Distant
  {
    title: 'Do you feel distant from God sometimes?',
    subtitle: 'It\'s okay to feel this way.',
    type: 'single',
    dataKey: 'feelsDistant',
    options: [
      { value: 'yes', label: 'Yes', sublabel: 'I often feel disconnected', icon: 'cloud-outline' },
      { value: 'no', label: 'No', sublabel: 'I feel His presence', icon: 'sunny-outline' },
    ],
  },
  // Step 8: Seeking
  {
    title: 'What are you seeking most?',
    subtitle: 'What draws your heart right now?',
    type: 'single',
    dataKey: 'seeking',
    options: [
      { value: 'peace', label: 'Peace', sublabel: 'Calm in the storm', icon: 'leaf-outline' },
      { value: 'discipline', label: 'Discipline', sublabel: 'Spiritual consistency', icon: 'fitness-outline' },
      { value: 'faith', label: 'Faith', sublabel: 'Deeper belief', icon: 'sparkles-outline' },
      { value: 'purpose', label: 'Purpose', sublabel: 'Direction in life', icon: 'compass-outline' },
      { value: 'love', label: 'Love', sublabel: 'Connection with others', icon: 'heart-outline' },
    ],
  },
  // Step 9: Temptation Strength (Slider)
  {
    title: 'How strong is temptation in your daily life?',
    subtitle: 'Drag to indicate the intensity you experience.',
    type: 'slider',
    dataKey: 'temptationStrength',
  },
  // Step 10: Doubt Frequency
  {
    title: 'How often do doubts appear?',
    subtitle: 'Doubt is part of the journey.',
    type: 'single',
    dataKey: 'doubtFrequency',
    options: [
      { value: 'low', label: 'Rarely', sublabel: 'Faith is steady', icon: 'shield-checkmark-outline' },
      { value: 'medium', label: 'Sometimes', sublabel: 'Occasional questioning', icon: 'help-circle-outline' },
      { value: 'high', label: 'Often', sublabel: 'Frequent struggles', icon: 'alert-circle-outline' },
    ],
  },
  // Step 11: Motivation
  {
    title: 'What motivates you most?',
    subtitle: 'What drives your spiritual growth?',
    type: 'single',
    dataKey: 'motivation',
    options: [
      { value: 'god', label: 'God', sublabel: 'His love and calling', icon: 'sparkles-outline' },
      { value: 'destiny', label: 'Destiny', sublabel: 'Fulfilling my purpose', icon: 'rocket-outline' },
      { value: 'love', label: 'Love', sublabel: 'For family and others', icon: 'heart-outline' },
      { value: 'strength', label: 'Becoming Stronger', sublabel: 'Personal growth', icon: 'trending-up-outline' },
    ],
  },
  // Step 12: Daily Guidance
  {
    title: 'Do you want daily spiritual guidance?',
    subtitle: 'We can send you personalized devotionals.',
    type: 'single',
    dataKey: 'wantsDailyGuidance',
    options: [
      { value: 'yes', label: 'Yes, please', sublabel: 'Help me stay consistent', icon: 'notifications-outline' },
      { value: 'no', label: 'Not right now', sublabel: 'I\'ll explore on my own', icon: 'close-circle-outline' },
    ],
  },
  // Step 13: Guidance Style
  {
    title: 'Do you prefer gentle guidance or direct truth?',
    subtitle: 'How should we speak to your heart?',
    type: 'single',
    dataKey: 'guidanceStyle',
    options: [
      { value: 'gentle', label: 'Gentle Guidance', sublabel: 'Encouraging and soft', icon: 'flower-outline' },
      { value: 'direct', label: 'Direct Truth', sublabel: 'Clear and bold', icon: 'flash-outline' },
    ],
  },
  // Step 14: Vision
  {
    title: 'Bible AI helps you grow consistently',
    subtitle: 'Your spiritual journey is about progress, not perfection.',
    type: 'vision',
  },
];

// Calculate age from birth date
function calculateAge(birthDate: Date): number {
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}

export default function OnboardingScreen() {
  const router = useRouter();
  const { onboardingData, updateOnboardingData, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(0);
  const [showLoading, setShowLoading] = useState(false);
  const [sliderValue, setSliderValue] = useState(0.5);
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(null);

  const step = STEPS[currentStep];

  const getCurrentValue = useCallback(() => {
    if (!step.dataKey) return undefined;
    
    if (step.dataKey === 'temptationStrength') {
      return sliderValue;
    }
    
    if (step.dataKey === 'birthDate') {
      return selectedBirthDate ? 'selected' : undefined;
    }
    
    const value = onboardingData[step.dataKey];
    if (step.dataKey === 'feelsDistant' || step.dataKey === 'wantsDailyGuidance') {
      return value === true ? 'yes' : value === false ? 'no' : undefined;
    }
    return value as string | undefined;
  }, [step, onboardingData, sliderValue, selectedBirthDate]);

  const handleOptionSelect = useCallback((value: string) => {
    if (!step.dataKey) return;
    
    if (step.dataKey === 'feelsDistant' || step.dataKey === 'wantsDailyGuidance') {
      updateOnboardingData(step.dataKey, value === 'yes');
    } else {
      updateOnboardingData(step.dataKey, value as any);
    }
  }, [step, updateOnboardingData]);

  const handleSliderChange = useCallback((value: number) => {
    setSliderValue(value);
    if (step.dataKey === 'temptationStrength') {
      updateOnboardingData('temptationStrength', value);
    }
  }, [step, updateOnboardingData]);

  const handleDateChange = useCallback((date: Date) => {
    // Only update if the date is different to prevent unnecessary rerenders
    setSelectedBirthDate((prev) => {
      if (prev && prev.getTime() === date.getTime()) {
        return prev;
      }
      return date;
    });
    const age = calculateAge(date);
    updateOnboardingData('birthDate', date.toISOString());
    updateOnboardingData('age', age);
  }, [updateOnboardingData]);

  const handleNext = useCallback(() => {
    if (currentStep < TOTAL_STEPS - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      // Show loading screen
      setShowLoading(true);
    }
  }, [currentStep]);

  const handleBack = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const handleLoadingComplete = useCallback(async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  }, [completeOnboarding, router]);

  if (showLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const currentValue = getCurrentValue();
  const isNextDisabled = (step.type === 'single' && !currentValue) || 
                         (step.type === 'datepicker' && !selectedBirthDate);

  return (
    <OnboardingLayout
      currentStep={currentStep + 1}
      totalSteps={TOTAL_STEPS}
      title={step.title}
      subtitle={step.subtitle}
      onBack={currentStep > 0 ? handleBack : undefined}
      onNext={handleNext}
      nextDisabled={isNextDisabled}
      nextLabel={currentStep === TOTAL_STEPS - 1 ? 'Get Started' : 'Continue'}
      showBackButton={currentStep > 0}
    >
      {step.type === 'single' && step.options && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.optionsScroll}>
          {step.options.map((option, index) => (
            <OptionCard
              key={option.value}
              label={option.label}
              sublabel={option.sublabel}
              icon={option.icon as any}
              selected={currentValue === option.value}
              onPress={() => handleOptionSelect(option.value)}
              index={index}
            />
          ))}
        </ScrollView>
      )}

      {step.type === 'slider' && (
        <SliderOption
          value={sliderValue}
          onValueChange={handleSliderChange}
          minLabel="Manageable"
          maxLabel="Overwhelming"
        />
      )}

      {step.type === 'datepicker' && (
        <DatePickerWheel onDateChange={handleDateChange} />
      )}

      {step.type === 'vision' && <VisionChart />}
    </OnboardingLayout>
  );
}

const styles = StyleSheet.create({
  optionsScroll: {
    paddingBottom: 20,
  },
});
