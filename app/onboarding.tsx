import { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList, Animated } from 'react-native';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { setItem } from '@/utils/storage';
import { Button } from '@/components/ui/Button';
import { theme } from '@/constants/Colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    key: 'ai',
    icon: '🤖',
    titleKey: 'onboarding.slide1Title',
    descKey: 'onboarding.slide1Desc',
    color: theme.primary,
  },
  {
    key: 'ats',
    icon: '📊',
    titleKey: 'onboarding.slide2Title',
    descKey: 'onboarding.slide2Desc',
    color: theme.secondary,
  },
  {
    key: 'pdf',
    icon: '📄',
    titleKey: 'onboarding.slide3Title',
    descKey: 'onboarding.slide3Desc',
    color: theme.success,
  },
];

export default function OnboardingScreen() {
  const { t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      await setItem('onboarding_done', 'true');
      router.replace('/(auth)/login');
    }
  };

  const handleSkip = async () => {
    await setItem('onboarding_done', 'true');
    router.replace('/(auth)/login');
  };

  const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
    <View style={[styles.slide, { width }]}>
      <View style={[styles.iconContainer, { backgroundColor: item.color + '15' }]}>
        <Text style={styles.icon}>{item.icon}</Text>
      </View>
      <Text style={styles.slideTitle}>{t(item.titleKey)}</Text>
      <Text style={styles.slideDesc}>{t(item.descKey)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.skipContainer}>
        {currentIndex < SLIDES.length - 1 && (
          <Button title={t('onboarding.skip')} variant="ghost" onPress={handleSkip} size="sm" />
        )}
      </View>

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        renderItem={renderSlide}
        keyExtractor={(item) => item.key}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        onMomentumScrollEnd={(e) => {
          setCurrentIndex(Math.round(e.nativeEvent.contentOffset.x / width));
        }}
      />

      <View style={styles.footer}>
        <View style={styles.dots}>
          {SLIDES.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [8, 24, 8],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.3, 1, 0.3],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i}
                style={[styles.dot, { width: dotWidth, opacity, backgroundColor: theme.primary }]}
              />
            );
          })}
        </View>

        <Button
          title={currentIndex === SLIDES.length - 1 ? t('onboarding.getStarted') : t('onboarding.next')}
          onPress={handleNext}
          style={{ width: '100%' }}
          size="lg"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.surface },
  skipContainer: {
    paddingTop: 56, paddingHorizontal: 16, alignItems: 'flex-end', height: 96,
  },
  slide: {
    flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 40,
  },
  iconContainer: {
    width: 120, height: 120, borderRadius: 60,
    justifyContent: 'center', alignItems: 'center', marginBottom: 40,
  },
  icon: { fontSize: 56 },
  slideTitle: {
    fontSize: 28, fontWeight: '800', color: theme.text,
    textAlign: 'center', marginBottom: 16,
  },
  slideDesc: {
    fontSize: 16, color: theme.textSecondary,
    textAlign: 'center', lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32, paddingBottom: 48, alignItems: 'center', gap: 24,
  },
  dots: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  dot: { height: 8, borderRadius: 4 },
});
