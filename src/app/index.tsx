import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';

export default function SplashScreen() {
  const router = useRouter();
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const floatAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.loop(
        Animated.sequence([
          Animated.timing(floatAnim, {
            toValue: -20,
            duration: 2000,
            useNativeDriver: true,
          }),
          Animated.timing(floatAnim, {
            toValue: 0,
            duration: 2000,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A', COLORS.background]}
        style={StyleSheet.absoluteFill}
      />
      
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [
              { scale: scaleAnim },
              { translateY: floatAnim }
            ],
          },
        ]}
      >
        <Image
          source={require('@/assets/images/splash_crystal.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Animated.Text style={styles.title}>StoneAI</Animated.Text>
        <Animated.Text style={styles.subtitle}>Premium Mineral Identification</Animated.Text>
      </Animated.View>
      
      <View style={styles.footer}>
        <View style={styles.loader} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: SIZES.large,
  },
  title: {
    fontSize: 48,
    fontWeight: '900',
    color: COLORS.primary,
    letterSpacing: 4,
    textTransform: 'uppercase',
    textShadowColor: 'rgba(255, 215, 0, 0.5)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 20,
  },
  subtitle: {
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    letterSpacing: 2,
    marginTop: SIZES.base,
  },
  footer: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    alignItems: 'center',
  },
  loader: {
    width: 40,
    height: 4,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    opacity: 0.3,
  },
});
