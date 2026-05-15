import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Dimensions, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles } from 'lucide-react-native';
import { identifyMineral } from '@/services/geminiService';
import * as FileSystem from 'expo-file-system/legacy';

const { width } = Dimensions.get('window');

const DATA_STREAMS = [
  'Analyzing mineral composition...',
  'Cross-referencing crystal structure...',
  'Comparing spectral signatures...',
  'Calculating Mohs hardness...',
  'Retrieving geological origin data...',
  'Estimating market valuation...',
];

export default function AIProcessingScreen() {
  const router = useRouter();
  const { imageUri } = useLocalSearchParams<{ imageUri: string }>();

  const rotation = useRef(new Animated.Value(0)).current;
  const pulse = useRef(new Animated.Value(1)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Spin animation
    Animated.loop(
      Animated.timing(rotation, { toValue: 1, duration: 4000, useNativeDriver: true })
    ).start();

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1.3, duration: 900, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    // Progress bar animation
    Animated.timing(progress, {
      toValue: 1,
      duration: 8000,
      useNativeDriver: false,
    }).start();

    // Call Gemini API
    const runIdentification = async () => {
      try {
        if (!imageUri) {
          throw new Error('No image provided');
        }

        // Read image as base64 here to avoid passing it through router params
        const base64Image = await FileSystem.readAsStringAsync(imageUri, {
          encoding: 'base64',
        });

        const result = await identifyMineral(base64Image);
        router.replace({
          pathname: '/scan/result',
          params: { 
            aiResult: JSON.stringify(result),
            imageUri: imageUri 
          },
        });
      } catch (err: any) {
        console.warn('Gemini error:', err?.message);
        router.replace({
          pathname: '/scan/result',
          params: {
            aiResult: '', // Empty result to trigger error state
            imageUri: imageUri,
            apiKeyMissing: err?.message === 'API_KEY_NOT_SET' ? 'true' : 'false',
            errorDetails: err?.message || 'Unknown error',
          },
        });
      }
    };

    runIdentification();
  }, []);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const progressBarWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#0D0D0D', COLORS.background]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>
        {/* Spinner */}
        <View style={styles.hologramContainer}>
          <Animated.View style={[styles.glow, { transform: [{ scale: pulse }] }]} />
          <Animated.View style={[styles.ring, { transform: [{ rotate: spin }] }]} />
          <Sparkles size={64} color={COLORS.primary} />
        </View>

        <View style={styles.textContainer}>
          <View style={styles.statusRow}>
            <Sparkles size={18} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.statusText}>Gemini AI Active</Text>
          </View>
          <Text style={styles.mainHint}>Identifying Specimen...</Text>
        </View>

        {/* Data Streams */}
        <View style={styles.dataStreams}>
          {DATA_STREAMS.map((text, i) => (
            <Text key={i} style={[styles.streamLine, { opacity: Math.max(0.1, 0.7 - i * 0.1) }]}>
              {'> '}{text}
            </Text>
          ))}
        </View>

        {/* Progress Bar */}
        <View style={styles.footer}>
          <View style={styles.progressLabelRow}>
            <Text style={styles.progressLabel}>Analyzing with Gemini Vision</Text>
          </View>
          <View style={styles.progressBarContainer}>
            <Animated.View style={[styles.progressBar, { width: progressBarWidth }]}>
              <LinearGradient
                colors={[COLORS.primary, COLORS.accent]}
                start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
              />
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  content: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: SIZES.padding },
  hologramContainer: {
    width: 180, height: 180,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 50,
  },
  glow: {
    position: 'absolute',
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: COLORS.primary, opacity: 0.15,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1, shadowRadius: 60,
  },
  ring: {
    position: 'absolute',
    width: 160, height: 160, borderRadius: 80,
    borderWidth: 2, borderColor: COLORS.primary,
    borderStyle: 'dashed', opacity: 0.4,
  },
  textContainer: { alignItems: 'center', marginBottom: 40 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  statusText: {
    color: COLORS.primary, fontSize: SIZES.medium,
    fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase',
  },
  mainHint: { color: COLORS.text, fontSize: 28, fontWeight: '800' },
  dataStreams: { width: '100%', paddingHorizontal: SIZES.padding, marginBottom: 50 },
  streamLine: {
    color: COLORS.success,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontSize: 12, marginBottom: 6,
  },
  footer: { width: '100%', paddingHorizontal: SIZES.padding },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { color: COLORS.textSecondary, fontSize: SIZES.small, fontWeight: '600' },
  progressBarContainer: {
    width: '100%', height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 3, overflow: 'hidden',
  },
  progressBar: { height: '100%', borderRadius: 3 },
});
