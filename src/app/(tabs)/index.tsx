import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Search, Bell, Sparkles, TrendingUp, Clock,
  Gem, Mountain, Flame, Layers, Box
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { getRandomFact } from '@/data/mineralFacts';
import { mineralApiService } from '@/services/mineralApiService';
import { Mineral } from '@/types/mineral';
import { getMineralImage } from '@/utils/getMineralImage';

const CATEGORIES = [
  { id: '1', name: 'Crystals', Icon: Gem },
  { id: '2', name: 'Minerals', Icon: Mountain },
  { id: '3', name: 'Gemstones', Icon: Sparkles },
  { id: '4', name: 'Igneous', Icon: Flame },
  { id: '5', name: 'Sedimentary', Icon: Layers },
  { id: '6', name: 'Metamorphic', Icon: Box },
];

const RARITY_COLORS: Record<string, string> = {
  Common: '#9CA3AF',
  Uncommon: '#34D399',
  Rare: '#60A5FA',
  'Very Rare': '#C084FC',
  Legendary: '#FBBF24',
};

export default function HomeDashboard() {
  const router = useRouter();
  const [dailyFact, setDailyFact] = useState<string>('');
  const [trendingMinerals, setTrendingMinerals] = useState<Mineral[]>([]);
  const [recentMinerals, setRecentMinerals] = useState<Mineral[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setDailyFact(getRandomFact());
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      const [trending, all] = await Promise.all([
        mineralApiService.getTrendingMinerals(),
        mineralApiService.getAllMinerals(1, 6),
      ]);
      setTrendingMinerals(trending.slice(0, 6));
      setRecentMinerals(all.slice(0, 4));
    } catch (err) {
      console.error('Failed to load home data:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderMineralCard = (mineral: Mineral) => {
    const localAsset = getMineralImage(mineral.category, mineral.imageKey);
    return (
      <TouchableOpacity
        key={mineral.id}
        style={styles.mineralCard}
        onPress={() => router.push({ pathname: '/guide/[id]', params: { id: mineral.id } })}
        activeOpacity={0.8}
      >
        <GlassCard style={styles.mineralCardInner} padding={0}>
          {localAsset ? (
            <Image
              source={localAsset}
              style={styles.mineralImage}
              resizeMode="cover"
            />
          ) : (
            <View style={[styles.mineralImage, { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }]}>
              <Gem size={28} color="rgba(255,255,255,0.25)" />
            </View>
          )}
          <View style={styles.mineralInfo}>
            <Text style={styles.mineralName} numberOfLines={1}>{mineral.name}</Text>
            <Text style={styles.mineralType} numberOfLines={1}>{mineral.type}</Text>
            <View style={styles.mineralMeta}>
              <View style={[styles.rarityBadge, { backgroundColor: (RARITY_COLORS[mineral.rarity] || '#9CA3AF') + '22' }]}>
                <Text style={[styles.rarityText, { color: RARITY_COLORS[mineral.rarity] || '#9CA3AF' }]}>
                  {mineral.rarity}
                </Text>
              </View>
              <Text style={styles.hardnessText}>⬡ {mineral.hardness}</Text>
            </View>
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  const renderSmallCard = (mineral: Mineral) => {
    const localAsset = getMineralImage(mineral.category, mineral.imageKey);
    return (
      <TouchableOpacity
        key={mineral.id}
        style={styles.smallCard}
        onPress={() => router.push({ pathname: '/guide/[id]', params: { id: mineral.id } })}
        activeOpacity={0.8}
      >
        <GlassCard style={styles.smallCardInner} padding={12}>
          <View style={styles.smallCardRow}>
            {localAsset ? (
              <Image
                source={localAsset}
                style={styles.smallImage}
                resizeMode="cover"
              />
            ) : (
              <View style={[styles.smallImage, { backgroundColor: '#1A1A1A', justifyContent: 'center', alignItems: 'center' }]}>
                <Gem size={16} color="rgba(255,255,255,0.3)" />
              </View>
            )}
            <View style={styles.smallCardText}>
              <Text style={styles.smallName} numberOfLines={1}>{mineral.name}</Text>
              <Text style={styles.smallCategory} numberOfLines={1}>{mineral.category}</Text>
            </View>
            <View style={[styles.rarityDot, { backgroundColor: RARITY_COLORS[mineral.rarity] || '#9CA3AF' }]} />
          </View>
        </GlassCard>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#1A1A1A']}
        style={StyleSheet.absoluteFill}
      />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcomeText}>Hello,</Text>
            <Text style={styles.userName}>Welcome Back</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={24} color={COLORS.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => router.push('/guide')}
        >
          <GlassCard style={styles.searchCard} padding={0}>
            <View style={styles.searchInner}>
              <Search size={20} color={COLORS.textSecondary} />
              <Text style={styles.searchPlaceholder}>Search minerals, crystals...</Text>
            </View>
          </GlassCard>
        </TouchableOpacity>

        {/* Daily Fact */}
        <TouchableOpacity activeOpacity={0.9}>
          <LinearGradient
            colors={[COLORS.primary, COLORS.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.dailyFactCard}
          >
            <View style={styles.factHeader}>
              <Sparkles size={20} color={COLORS.background} />
              <Text style={styles.factTitle}>Daily Mineral Fact</Text>
            </View>
            <Text style={styles.factText}>
              {dailyFact || 'Loading your daily mineral fact...'}
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity onPress={() => router.push('/guide')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map((cat) => {
            const IconComponent = cat.Icon;
            return (
              <TouchableOpacity
                key={cat.id}
                style={styles.categoryItem}
                onPress={() => router.push('/guide')}
              >
                <GlassCard style={styles.categoryCard} padding={12}>
                  <View style={styles.categoryIconContainer}>
                    <IconComponent size={24} color={COLORS.primary} />
                  </View>
                  <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Trending Now */}
        <View style={styles.sectionHeader}>
          <View style={styles.row}>
            <TrendingUp size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/guide')}>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : trendingMinerals.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.trendingList}>
            {trendingMinerals.map(renderMineralCard)}
          </ScrollView>
        ) : (
          <Text style={styles.emptyText}>No trending minerals yet</Text>
        )}

        {/* Recent Minerals */}
        <View style={[styles.sectionHeader, { marginTop: 8 }]}>
          <View style={styles.row}>
            <Clock size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>All Minerals</Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/guide')}>
            <Text style={styles.viewAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator color={COLORS.primary} style={{ marginVertical: 20 }} />
        ) : recentMinerals.length > 0 ? (
          <View style={styles.recentList}>
            {recentMinerals.map(renderSmallCard)}
          </View>
        ) : (
          <Text style={styles.emptyText}>No minerals found</Text>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { paddingTop: 60, paddingHorizontal: SIZES.padding },
  header: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SIZES.extraLarge,
  },
  welcomeText: { color: COLORS.textSecondary, fontSize: SIZES.medium },
  userName: { color: COLORS.text, fontSize: SIZES.extraLarge, fontWeight: '800' },
  notificationBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: COLORS.surface, justifyContent: 'center',
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.glassBorder,
  },
  badge: {
    position: 'absolute', top: 12, right: 12,
    width: 10, height: 10, borderRadius: 5,
    backgroundColor: COLORS.primary, borderWidth: 2, borderColor: COLORS.surface,
  },
  searchCard: { marginBottom: SIZES.extraLarge, height: 54, justifyContent: 'center' },
  searchInner: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: '100%' },
  searchPlaceholder: { flex: 1, marginLeft: 12, color: COLORS.textMuted, fontSize: SIZES.medium },
  dailyFactCard: { padding: SIZES.padding, borderRadius: SIZES.radius, marginBottom: SIZES.extraLarge },
  factHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: SIZES.base },
  factTitle: { color: COLORS.background, fontSize: SIZES.medium, fontWeight: '800', marginLeft: 8 },
  factText: { color: COLORS.background, fontSize: SIZES.font, lineHeight: 20, opacity: 0.9 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: SIZES.medium,
  },
  row: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { color: COLORS.text, fontSize: SIZES.large, fontWeight: '700' },
  viewAll: { color: COLORS.primary, fontWeight: '600' },
  categoriesList: { paddingRight: SIZES.padding, marginBottom: SIZES.extraLarge },
  categoryItem: { marginRight: SIZES.medium },
  categoryCard: { padding: SIZES.small, alignItems: 'center', width: 90 },
  categoryIconContainer: { marginBottom: 8, alignItems: 'center', justifyContent: 'center', height: 32 },
  categoryName: { color: COLORS.text, fontSize: 11, fontWeight: '700', textAlign: 'center' },
  // Trending
  trendingList: { paddingRight: SIZES.padding, marginBottom: SIZES.extraLarge, gap: 12 },
  mineralCard: { width: 160 },
  mineralCardInner: { overflow: 'hidden' },
  mineralImage: { width: '100%', height: 110, borderRadius: 12 },
  mineralInfo: { padding: 10 },
  mineralName: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  mineralType: { color: COLORS.textSecondary, fontSize: 11, marginTop: 2 },
  mineralMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 },
  rarityBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  rarityText: { fontSize: 10, fontWeight: '700' },
  hardnessText: { color: COLORS.textMuted, fontSize: 10 },
  // Recent / Small cards
  recentList: { gap: 10, marginBottom: SIZES.extraLarge },
  smallCard: {},
  smallCardInner: {},
  smallCardRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  smallImage: { width: 48, height: 48, borderRadius: 10 },
  smallCardText: { flex: 1 },
  smallName: { color: COLORS.text, fontSize: 14, fontWeight: '700' },
  smallCategory: { color: COLORS.textSecondary, fontSize: 12, marginTop: 2 },
  rarityDot: { width: 8, height: 8, borderRadius: 4 },
  emptyText: { color: COLORS.textMuted, textAlign: 'center', marginVertical: 20 },
});
