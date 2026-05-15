import React from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { GlowButton } from '@/components/ui/GlowButton';
import { LinearGradient } from 'expo-linear-gradient';
import { X, Crown, Check, Zap, Shield, Sparkles } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const FEATURES = [
  "Unlimited AI identification",
  "High-precision molecular analysis",
  "Advanced market value appraisals",
  "Exclusive discovery hotspots map",
  "Direct chat with expert geologists",
  "Ad-free premium experience",
];

export default function PremiumSubscriptionScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A1A1A', '#050505']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
            <X color="#fff" size={24} />
          </TouchableOpacity>
          <View style={styles.crownCircle}>
            <Crown size={40} color={COLORS.primary} fill={COLORS.primary} />
          </View>
          <Text style={styles.title}>Go Premium</Text>
          <Text style={styles.subtitle}>Unlock the full power of StoneAI</Text>
        </View>

        {/* Features List */}
        <View style={styles.featuresContainer}>
          {FEATURES.map((feature, i) => (
            <View key={i} style={styles.featureItem}>
              <View style={styles.checkCircle}>
                <Check size={14} color={COLORS.primary} strokeWidth={3} />
              </View>
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
        </View>

        {/* Pricing Tiers */}
        <View style={styles.tiersContainer}>
          {/* Annual Tier - Recommended */}
          <TouchableOpacity activeOpacity={0.9} style={styles.tierItem}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.recommendedBadge}
            >
              <Text style={styles.recommendedText}>MOST POPULAR</Text>
            </LinearGradient>
            <GlassCard style={[styles.tierCard, styles.activeTierCard]}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierName}>Annual Elite</Text>
                <View style={styles.tierPriceContainer}>
                  <Text style={styles.tierPrice}>$49.99</Text>
                  <Text style={styles.tierDuration}>/ year</Text>
                </View>
              </View>
              <Text style={styles.tierSaving}>Save 58% compared to monthly</Text>
            </GlassCard>
          </TouchableOpacity>

          {/* Monthly Tier */}
          <TouchableOpacity activeOpacity={0.9} style={styles.tierItem}>
            <GlassCard style={styles.tierCard}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierName}>Monthly Access</Text>
                <View style={styles.tierPriceContainer}>
                  <Text style={styles.tierPrice}>$9.99</Text>
                  <Text style={styles.tierDuration}>/ month</Text>
                </View>
              </View>
            </GlassCard>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={styles.footer}>
          <GlowButton
            title="Start 7-Day Free Trial"
            onPress={() => router.back()}
            style={styles.mainCta}
          />
          <Text style={styles.footerNote}>No commitment. Cancel anytime.</Text>
        </View>

        {/* Social Proof / Security */}
        <View style={styles.securityRow}>
          <View style={styles.securityItem}>
            <Shield size={16} color={COLORS.textSecondary} />
            <Text style={styles.securityText}>Secure SSL</Text>
          </View>
          <View style={styles.securityItem}>
            <Zap size={16} color={COLORS.textSecondary} />
            <Text style={styles.securityText}>Instant Access</Text>
          </View>
          <View style={styles.securityItem}>
            <Sparkles size={16} color={COLORS.textSecondary} />
            <Text style={styles.securityText}>Top Rated</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    padding: SIZES.padding,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    left: 0,
    padding: 8,
  },
  crownCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  title: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 8,
  },
  subtitle: {
    color: COLORS.textSecondary,
    fontSize: SIZES.medium,
  },
  featuresContainer: {
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  featureText: {
    color: COLORS.text,
    fontSize: SIZES.font,
    fontWeight: '500',
  },
  tiersContainer: {
    gap: SIZES.large,
    marginBottom: 40,
  },
  tierItem: {
    width: '100%',
  },
  tierCard: {
    padding: SIZES.extraLarge,
  },
  activeTierCard: {
    borderColor: COLORS.primary,
    borderWidth: 2,
    backgroundColor: 'rgba(255, 215, 0, 0.05)',
  },
  recommendedBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 10,
    zIndex: 10,
  },
  recommendedText: {
    color: COLORS.background,
    fontSize: 10,
    fontWeight: '900',
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tierName: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '800',
  },
  tierPriceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  tierPrice: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '900',
  },
  tierDuration: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginLeft: 2,
  },
  tierSaving: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: 8,
  },
  footer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  mainCta: {
    width: '100%',
    height: 64,
  },
  footerNote: {
    color: COLORS.textMuted,
    fontSize: 12,
    marginTop: 16,
  },
  securityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    opacity: 0.6,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  securityText: {
    color: COLORS.textSecondary,
    fontSize: 10,
    fontWeight: '600',
  },
});
