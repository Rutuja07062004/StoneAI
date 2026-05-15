import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, Share2, Heart, Shield, Info } from 'lucide-react-native';

export default function MineralDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />
      
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1596450514735-310325fa890c?auto=format&fit=crop&q=80&w=600' }}
            style={styles.heroImage}
          />
          <LinearGradient
            colors={['transparent', COLORS.background]}
            style={styles.imageOverlay}
          />
          <View style={styles.headerBtns}>
            <TouchableOpacity onPress={() => router.back()} style={styles.circleBtn}>
              <ArrowLeft color="#fff" size={24} />
            </TouchableOpacity>
            <View style={styles.rightHeaderBtns}>
              <TouchableOpacity style={styles.circleBtn}>
                <Heart color="#fff" size={24} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.circleBtn}>
                <Share2 color="#fff" size={24} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.name}>Premium Emerald</Text>
          <View style={styles.badgeRow}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Gemstone</Text>
            </View>
            <View style={[styles.badge, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Text style={[styles.badgeText, { color: COLORS.success }]}>99.8% Match</Text>
            </View>
          </View>

          <Text style={styles.description}>
            This premium emerald specimen exhibits deep green saturation and exceptional transparency. Originating from the Muzo mine in Colombia, it showcases the classic hexagonal crystal system characteristic of high-quality beryl.
          </Text>

          <GlassCard style={styles.valueCard}>
            <View>
              <Text style={styles.valueLabel}>Estimated Value</Text>
              <Text style={styles.valueAmount}>$1,250.00</Text>
            </View>
            <View style={styles.valuationBadge}>
              <Shield size={16} color={COLORS.primary} />
              <Text style={styles.valuationText}>Verified</Text>
            </View>
          </GlassCard>

          <View style={styles.specsGrid}>
            <GlassCard style={styles.specCard}>
              <Info size={20} color={COLORS.primary} />
              <Text style={styles.specVal}>7.5 - 8</Text>
              <Text style={styles.specLabel}>Hardness</Text>
            </GlassCard>
            <GlassCard style={styles.specCard}>
              <Info size={20} color={COLORS.primary} />
              <Text style={styles.specVal}>Hexagonal</Text>
              <Text style={styles.specLabel}>System</Text>
            </GlassCard>
          </View>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  imageContainer: {
    height: 400,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 200,
  },
  headerBtns: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rightHeaderBtns: {
    flexDirection: 'row',
    gap: 12,
  },
  circleBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: SIZES.padding,
    marginTop: -40,
  },
  name: {
    color: COLORS.text,
    fontSize: 32,
    fontWeight: '900',
    marginBottom: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 20,
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  badgeText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 24,
    marginBottom: 30,
  },
  valueCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SIZES.extraLarge,
    marginBottom: 20,
  },
  valueLabel: {
    color: COLORS.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  valueAmount: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: '900',
  },
  valuationBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 12,
  },
  valuationText: {
    color: COLORS.primary,
    fontSize: 12,
    fontWeight: '800',
  },
  specsGrid: {
    flexDirection: 'row',
    gap: 15,
  },
  specCard: {
    flex: 1,
    padding: SIZES.large,
    alignItems: 'center',
  },
  specVal: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '800',
    marginTop: 10,
  },
  specLabel: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
});
