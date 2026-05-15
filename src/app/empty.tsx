import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlowButton } from '@/components/ui/GlowButton';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, ArrowLeft } from 'lucide-react-native';

export default function EmptyStateScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ArrowLeft color="#fff" size={24} />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Sparkles size={60} color={COLORS.primary} opacity={0.2} />
          <View style={styles.pulseInner} />
        </View>
        
        <Text style={styles.title}>Start Your Journey</Text>
        <Text style={styles.description}>
          Your vault is currently empty. Scan your first mineral to begin building your elite collection.
        </Text>

        <GlowButton
          title="Scan Now"
          onPress={() => router.push('/scan')}
          style={styles.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
  },
  backBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.padding * 2,
  },
  iconContainer: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.1)',
  },
  pulseInner: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    opacity: 0.1,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 16,
    textAlign: 'center',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 40,
  },
  cta: {
    width: 200,
  },
});
