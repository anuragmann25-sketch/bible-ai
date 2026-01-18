import React, { useState, useMemo } from 'react';
import { useRouter } from 'expo-router';
import { useOnboarding } from '../context/OnboardingContext';
import {
  OnboardingLayout,
  OptionCard,
  SliderOption,
  VisionChart,
  LoadingScreen,
  DatePickerWheel,
} from '../components/onboarding';

const TOTAL_STEPS = 13;

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateOnboardingData, onboardingData, completeOnboarding } = useOnboarding();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [birthDate, setBirthDate] = useState<Date | null>(null);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsLoading(true);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleLoadingComplete = async () => {
    await completeOnboarding();
    router.replace('/(tabs)');
  };

  const handleDateChange = (date: Date) => {
    setBirthDate(date);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const adjustedAge = monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())
      ? age - 1
      : age;
    
    updateOnboardingData('birthDate', date.toISOString());
    updateOnboardingData('age', adjustedAge);
  };

  const isNextDisabled = useMemo(() => {
    switch (currentStep) {
      case 1: return !onboardingData.gender;
      case 2: return !birthDate;
      case 3: return !onboardingData.spiritualState;
      case 4: return !onboardingData.prayerFrequency;
      case 5: return onboardingData.temptationStrength === undefined;
      case 6: return !onboardingData.biggestStruggle;
      case 7: return !onboardingData.currentStruggle;
      case 8: return onboardingData.feelsDistant === undefined;
      case 9: return !onboardingData.seeking;
      case 10: return !onboardingData.doubtFrequency;
      case 11: return false;
      case 12: return !onboardingData.motivation;
      case 13: return !onboardingData.guidanceStyle;
      default: return false;
    }
  }, [currentStep, onboardingData, birthDate]);

  if (isLoading) {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="What is your gender?"
            subtitle="This helps personalize your spiritual journey"
            onNext={handleNext}
            nextDisabled={isNextDisabled}
            showBackButton={false}
          >
            <OptionCard
              label="Male"
              icon="man-outline"
              selected={onboardingData.gender === 'male'}
              onPress={() => updateOnboardingData('gender', 'male')}
              index={0}
            />
            <OptionCard
              label="Female"
              icon="woman-outline"
              selected={onboardingData.gender === 'female'}
              onPress={() => updateOnboardingData('gender', 'female')}
              index={1}
            />
          </OnboardingLayout>
        );

      case 2:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="When were you born?"
            subtitle="We use this to personalize your experience"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <DatePickerWheel
              onDateChange={handleDateChange}
              initialDate={birthDate || undefined}
            />
          </OnboardingLayout>
        );

      case 3:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="Where are you spiritually right now?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Lost"
              sublabel="Feeling disconnected from faith"
              icon="help-circle-outline"
              selected={onboardingData.spiritualState === 'lost'}
              onPress={() => updateOnboardingData('spiritualState', 'lost')}
              index={0}
            />
            <OptionCard
              label="Searching"
              sublabel="Looking for deeper meaning"
              icon="search-outline"
              selected={onboardingData.spiritualState === 'searching'}
              onPress={() => updateOnboardingData('spiritualState', 'searching')}
              index={1}
            />
            <OptionCard
              label="Strong"
              sublabel="Confident in my faith"
              icon="shield-checkmark-outline"
              selected={onboardingData.spiritualState === 'strong'}
              onPress={() => updateOnboardingData('spiritualState', 'strong')}
              index={2}
            />
            <OptionCard
              label="Returning"
              sublabel="Coming back after time away"
              icon="return-down-back-outline"
              selected={onboardingData.spiritualState === 'returning'}
              onPress={() => updateOnboardingData('spiritualState', 'returning')}
              index={3}
            />
          </OnboardingLayout>
        );

      case 4:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="How often do you pray?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Daily"
              sublabel="A consistent daily rhythm"
              icon="sunny-outline"
              selected={onboardingData.prayerFrequency === 'daily'}
              onPress={() => updateOnboardingData('prayerFrequency', 'daily')}
              index={0}
            />
            <OptionCard
              label="Weekly"
              sublabel="A regular but flexible practice"
              icon="calendar-outline"
              selected={onboardingData.prayerFrequency === 'weekly'}
              onPress={() => updateOnboardingData('prayerFrequency', 'weekly')}
              index={1}
            />
            <OptionCard
              label="Sometimes"
              sublabel="Faith fits where it can"
              icon="time-outline"
              selected={onboardingData.prayerFrequency === 'sometimes'}
              onPress={() => updateOnboardingData('prayerFrequency', 'sometimes')}
              index={2}
            />
            <OptionCard
              label="Rarely"
              sublabel="Faith is present but irregular"
              icon="moon-outline"
              selected={onboardingData.prayerFrequency === 'rarely'}
              onPress={() => updateOnboardingData('prayerFrequency', 'rarely')}
              index={3}
            />
          </OnboardingLayout>
        );

      case 5:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="How strong is temptation in your life?"
            subtitle={"Temptation is part of being human.\nThis helps us understand where you need strength and grace."}
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <SliderOption
              value={onboardingData.temptationStrength ?? 0.5}
              onValueChange={(value) => updateOnboardingData('temptationStrength', value)}
              minLabel="Weak"
              maxLabel="Strong"
            />
          </OnboardingLayout>
        );

      case 6:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="What's your biggest spiritual struggle?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Fear & Anxiety"
              sublabel="Worry weighs heavily on my heart"
              icon="alert-circle-outline"
              selected={onboardingData.biggestStruggle === 'fear'}
              onPress={() => updateOnboardingData('biggestStruggle', 'fear')}
              index={0}
            />
            <OptionCard
              label="Doubt"
              sublabel="Questions about faith and belief"
              icon="help-outline"
              selected={onboardingData.biggestStruggle === 'doubt'}
              onPress={() => updateOnboardingData('biggestStruggle', 'doubt')}
              index={1}
            />
            <OptionCard
              label="Purpose"
              sublabel="Searching for meaning and direction"
              icon="compass-outline"
              selected={onboardingData.biggestStruggle === 'purpose'}
              onPress={() => updateOnboardingData('biggestStruggle', 'purpose')}
              index={2}
            />
            <OptionCard
              label="Temptation"
              sublabel="Fighting desires that pull me away"
              icon="flame-outline"
              selected={onboardingData.biggestStruggle === 'temptation'}
              onPress={() => updateOnboardingData('biggestStruggle', 'temptation')}
              index={3}
            />
          </OnboardingLayout>
        );

      case 7:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="What are you struggling with right now?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Relationships"
              sublabel="Connection with loved ones"
              icon="heart-outline"
              selected={onboardingData.currentStruggle === 'relationships'}
              onPress={() => updateOnboardingData('currentStruggle', 'relationships')}
              index={0}
            />
            <OptionCard
              label="Career & Work"
              sublabel="Finding purpose in my work"
              icon="briefcase-outline"
              selected={onboardingData.currentStruggle === 'career'}
              onPress={() => updateOnboardingData('currentStruggle', 'career')}
              index={1}
            />
            <OptionCard
              label="Health"
              sublabel="Physical or mental wellbeing"
              icon="fitness-outline"
              selected={onboardingData.currentStruggle === 'health'}
              onPress={() => updateOnboardingData('currentStruggle', 'health')}
              index={2}
            />
            <OptionCard
              label="Personal Growth"
              sublabel="Becoming a better person"
              icon="trending-up-outline"
              selected={onboardingData.currentStruggle === 'growth'}
              onPress={() => updateOnboardingData('currentStruggle', 'growth')}
              index={3}
            />
          </OnboardingLayout>
        );

      case 8:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="Do you sometimes feel distant from God?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Yes, often"
              sublabel="I struggle to feel His presence"
              icon="cloudy-outline"
              selected={onboardingData.feelsDistant === true}
              onPress={() => updateOnboardingData('feelsDistant', true)}
              index={0}
            />
            <OptionCard
              label="No, I feel close"
              sublabel="I sense His guidance often"
              icon="sunny-outline"
              selected={onboardingData.feelsDistant === false}
              onPress={() => updateOnboardingData('feelsDistant', false)}
              index={1}
            />
          </OnboardingLayout>
        );

      case 9:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="What are you seeking most?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Peace"
              sublabel="Calm in the midst of chaos"
              icon="leaf-outline"
              selected={onboardingData.seeking === 'peace'}
              onPress={() => updateOnboardingData('seeking', 'peace')}
              index={0}
            />
            <OptionCard
              label="Strength"
              sublabel="Power to face life's challenges"
              icon="barbell-outline"
              selected={onboardingData.seeking === 'strength'}
              onPress={() => updateOnboardingData('seeking', 'strength')}
              index={1}
            />
            <OptionCard
              label="Guidance"
              sublabel="Clarity for the path ahead"
              icon="navigate-outline"
              selected={onboardingData.seeking === 'guidance'}
              onPress={() => updateOnboardingData('seeking', 'guidance')}
              index={2}
            />
            <OptionCard
              label="Connection"
              sublabel="Deeper bond with God and others"
              icon="people-outline"
              selected={onboardingData.seeking === 'connection'}
              onPress={() => updateOnboardingData('seeking', 'connection')}
              index={3}
            />
          </OnboardingLayout>
        );

      case 10:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="How often do you experience doubt?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Rarely"
              sublabel="Faith is steady"
              icon="shield-outline"
              selected={onboardingData.doubtFrequency === 'low'}
              onPress={() => updateOnboardingData('doubtFrequency', 'low')}
              index={0}
            />
            <OptionCard
              label="Sometimes"
              sublabel="Questions arise occasionally"
              icon="help-circle-outline"
              selected={onboardingData.doubtFrequency === 'medium'}
              onPress={() => updateOnboardingData('doubtFrequency', 'medium')}
              index={1}
            />
            <OptionCard
              label="Often"
              sublabel="Wrestling with faith regularly"
              icon="thunderstorm-outline"
              selected={onboardingData.doubtFrequency === 'high'}
              onPress={() => updateOnboardingData('doubtFrequency', 'high')}
              index={2}
            />
          </OnboardingLayout>
        );

      case 11:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="Your spiritual growth over time"
            subtitle="Here's what consistent practice can do"
            onBack={handleBack}
            onNext={handleNext}
            nextLabel="I'm Ready"
          >
            <VisionChart />
          </OnboardingLayout>
        );

      case 12:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="What motivates you most?"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
          >
            <OptionCard
              label="Personal transformation"
              sublabel="Becoming the best version of myself"
              icon="sparkles-outline"
              selected={onboardingData.motivation === 'transformation'}
              onPress={() => updateOnboardingData('motivation', 'transformation')}
              index={0}
            />
            <OptionCard
              label="Deeper relationship with God"
              sublabel="Growing closer to the Creator"
              icon="heart-outline"
              selected={onboardingData.motivation === 'relationship'}
              onPress={() => updateOnboardingData('motivation', 'relationship')}
              index={1}
            />
            <OptionCard
              label="Overcoming challenges"
              sublabel="Rising above life's obstacles"
              icon="trophy-outline"
              selected={onboardingData.motivation === 'challenges'}
              onPress={() => updateOnboardingData('motivation', 'challenges')}
              index={2}
            />
            <OptionCard
              label="Finding peace"
              sublabel="Inner stillness and contentment"
              icon="water-outline"
              selected={onboardingData.motivation === 'peace'}
              onPress={() => updateOnboardingData('motivation', 'peace')}
              index={3}
            />
          </OnboardingLayout>
        );

      case 13:
        return (
          <OnboardingLayout
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            title="How would you like guidance?"
            subtitle="Choose what resonates with you"
            onBack={handleBack}
            onNext={handleNext}
            nextDisabled={isNextDisabled}
            nextLabel="Begin Journey"
          >
            <OptionCard
              label="Gentle & encouraging"
              sublabel="Soft reminders and warm guidance"
              icon="heart-circle-outline"
              selected={onboardingData.guidanceStyle === 'gentle'}
              onPress={() => updateOnboardingData('guidanceStyle', 'gentle')}
              index={0}
            />
            <OptionCard
              label="Direct & clear"
              sublabel="Straightforward wisdom and truth"
              icon="flash-outline"
              selected={onboardingData.guidanceStyle === 'direct'}
              onPress={() => updateOnboardingData('guidanceStyle', 'direct')}
              index={1}
            />
          </OnboardingLayout>
        );

      default:
        return null;
    }
  };

  return renderStep();
}
