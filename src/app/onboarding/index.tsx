import React, { useState, useRef } from 'react';
import { StyleSheet, View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@/constants/theme';
import { GlowButton } from '@/components/ui/GlowButton';
import { LinearGradient } from 'expo-linear-gradient';
import { ChevronRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: 1,
    title: 'Precision AI Scanning',
    description: 'Our advanced neural network identifies minerals with 99.8% geological accuracy.',
    image: require('@/assets/images/onboarding_scanner.png'),
  },
  {
    id: 2,
    title: 'Global Collection',
    description: 'Build your digital vault of rare specimens and track their market valuation.',
    image: require('@/assets/images/hero_minerals.png'),
  },
  {
    id: 3,
    title: 'Expert Insights',
    description: 'Access scientific data, chemical compositions, and origin stories for every stone.',
    image: require('@/assets/images/splash_crystal.png'),
  },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useSharedValue(0);
  const flatListRef = useRef<any>(null);

  const onScroll = (event: any) => {
    scrollX.value = event.nativeEvent.contentOffset.x;
    setCurrentIndex(Math.round(event.nativeEvent.contentOffset.x / width));
  };

  const handleNext = () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      router.push('/(auth)/login');
    }
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#121212', COLORS.background]}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.image} resizeMode="contain" />
              <LinearGradient
                colors={['transparent', COLORS.background]}
                style={styles.imageOverlay}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
      />

      <View style={styles.footer}>
        <View style={styles.indicatorContainer}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                { 
                  backgroundColor: currentIndex === index ? COLORS.primary : COLORS.textMuted,
                  width: currentIndex === index ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
          
          <GlowButton 
            title={currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'} 
            onPress={handleNext}
            style={styles.nextButton}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  slide: {
    width,
    flex: 1,
  },
  imageContainer: {
    flex: 0.6,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  image: {
    width: width * 0.85,
    height: width * 0.85,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
  },
  textContainer: {
    flex: 0.4,
    paddingHorizontal: SIZES.padding * 1.5,
    alignItems: 'center',
  },
  title: {
    fontSize: SIZES.title,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  description: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: SIZES.padding * 1.5,
    paddingBottom: 60,
  },
  indicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: SIZES.extraLarge,
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skipText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.medium,
    fontWeight: '600',
  },
  nextButton: {
    width: 140,
  },
});
