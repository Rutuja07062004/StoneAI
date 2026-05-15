import React from 'react';
import { StyleSheet, View, Text, ScrollView, Image, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Sparkles, TrendingUp, Clock, Grid } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const CATEGORIES = [
  { id: '1', name: 'Crystals', icon: '💎' },
  { id: '2', name: 'Metals', icon: '🪙' },
  { id: '3', name: 'Gems', icon: '✨' },
  { id: '4', name: 'Fossils', icon: '🦴' },
  { id: '5', name: 'Meteorites', icon: '☄️' },
];

const TRENDING = [
  { id: 't1', name: 'TEST - RED BOX', price: '$240', rarity: 'Common', image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==' },
  { id: 't2', name: 'New Sapphire', price: '$1,800', rarity: 'Rare', image: 'https://images.pexels.com/photos/10186522/pexels-photo-10186522.jpeg?auto=compress&cs=tinysrgb&w=400' },
  { id: 't3', name: 'New Emerald', price: '$3,200', rarity: 'Epic', image: 'https://images.pexels.com/photos/10186523/pexels-photo-10186523.jpeg?auto=compress&cs=tinysrgb&w=400' },
];

export default function HomeDashboard() {
  const router = useRouter();

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
            <Text style={styles.welcomeText}>Welcome back,</Text>
            <Text style={styles.userName}>Alex Sterling</Text>
          </View>
          <TouchableOpacity style={styles.notificationBtn}>
            <Bell size={24} color={COLORS.text} />
            <View style={styles.badge} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <GlassCard style={styles.searchCard} padding={0}>
          <View style={styles.searchInner}>
            <Search size={20} color={COLORS.textSecondary} />
            <TextInput
              placeholder="Search minerals, crystals..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.searchInput}
            />
          </View>
        </GlassCard>

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
              Diamonds aren't actually the hardest material on Earth. Lonsdaleite, a rare mineral found in meteorite impact sites, is 58% harder.
            </Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesList}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity key={cat.id} style={styles.categoryItem}>
              <GlassCard style={styles.categoryCard} padding={12}>
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryName} numberOfLines={1}>{cat.name}</Text>
              </GlassCard>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Trending */}
        <View style={styles.sectionHeader}>
          <View style={styles.row}>
            <TrendingUp size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
        </View>
        <FlatList
          data={TRENDING}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.trendingList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push({ pathname: '/details/[id]', params: { id: item.id } } as any)}>
              <GlassCard style={styles.trendingCard}>
                <Image source={{ uri: item.image }} style={styles.trendingImage} />
                <View style={styles.trendingInfo}>
                  <Text style={styles.trendingName}>{item.name}</Text>
                  <View style={styles.trendingMeta}>
                    <Text style={styles.trendingPrice}>{item.price}</Text>
                    <View style={[styles.rarityBadge, { backgroundColor: item.rarity === 'Epic' ? '#9333EA' : item.rarity === 'Rare' ? '#2563EB' : '#10B981' }]}>
                      <Text style={styles.rarityText}>{item.rarity}</Text>
                    </View>
                  </View>
                </View>
              </GlassCard>
            </TouchableOpacity>
          )}
        />

        {/* Recent Discoveries */}
        <View style={styles.sectionHeader}>
          <View style={styles.row}>
            <Clock size={20} color={COLORS.primary} style={{ marginRight: 8 }} />
            <Text style={styles.sectionTitle}>Recent Discoveries</Text>
          </View>
        </View>
        <GlassCard style={styles.recentDiscoveryCard}>
          <View style={styles.discoveryContent}>
            <Image 
              source={{ uri: 'https://images.unsplash.com/photo-1611083360739-bdad6e0eb1fa?auto=format&fit=crop&q=80&w=400' }} 
              style={styles.discoveryThumb} 
            />
            <View style={styles.discoveryInfo}>
              <Text style={styles.discoveryName}>Raw Emerald Crystal</Text>
              <Text style={styles.discoveryDate}>Discovered 2 hours ago • Bristol, UK</Text>
              <View style={styles.confidenceRow}>
                <Text style={styles.confidenceText}>AI Confidence: 98%</Text>
              </View>
            </View>
          </View>
        </GlassCard>

        <View style={{ height: 120 }} />
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
    paddingTop: 60,
    paddingHorizontal: SIZES.padding,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.extraLarge,
  },
  welcomeText: {
    color: COLORS.textSecondary,
    fontSize: SIZES.medium,
  },
  userName: {
    color: COLORS.text,
    fontSize: SIZES.extraLarge,
    fontWeight: '800',
  },
  notificationBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
  },
  badge: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  searchCard: {
    marginBottom: SIZES.extraLarge,
    height: 54,
    justifyContent: 'center',
  },
  searchInner: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: '100%',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: COLORS.text,
    fontSize: SIZES.medium,
    height: '100%',
  },
  dailyFactCard: {
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    marginBottom: SIZES.extraLarge,
  },
  factHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.base,
  },
  factTitle: {
    color: COLORS.background,
    fontSize: SIZES.medium,
    fontWeight: '800',
    marginLeft: 8,
  },
  factText: {
    color: COLORS.background,
    fontSize: SIZES.font,
    lineHeight: 20,
    opacity: 0.9,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: SIZES.large,
    fontWeight: '700',
  },
  viewAll: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  categoriesList: {
    paddingRight: SIZES.padding,
    marginBottom: SIZES.extraLarge,
  },
  categoryItem: {
    marginRight: SIZES.medium,
  },
  categoryCard: {
    padding: SIZES.small,
    alignItems: 'center',
    width: 90,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  categoryName: {
    color: COLORS.text,
    fontSize: 11,
    fontWeight: '700',
    textAlign: 'center',
  },
  trendingList: {
    paddingRight: SIZES.padding,
    marginBottom: SIZES.extraLarge,
  },
  trendingCard: {
    width: 220,
    padding: 0,
    marginRight: SIZES.medium,
    overflow: 'hidden',
  },
  trendingImage: {
    width: '100%',
    height: 120,
    borderTopLeftRadius: SIZES.radius,
    borderTopRightRadius: SIZES.radius,
  },
  trendingInfo: {
    padding: SIZES.medium,
  },
  trendingName: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '700',
    marginBottom: SIZES.base,
  },
  trendingMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  trendingPrice: {
    color: COLORS.primary,
    fontWeight: '800',
  },
  rarityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rarityText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '900',
    textTransform: 'uppercase',
  },
  recentDiscoveryCard: {
    marginBottom: SIZES.extraLarge,
  },
  discoveryContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  discoveryThumb: {
    width: 60,
    height: 60,
    borderRadius: SIZES.radius,
    marginRight: SIZES.medium,
  },
  discoveryInfo: {
    flex: 1,
  },
  discoveryName: {
    color: COLORS.text,
    fontSize: SIZES.medium,
    fontWeight: '700',
  },
  discoveryDate: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginTop: 4,
  },
  confidenceRow: {
    marginTop: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    backgroundColor: 'rgba(0, 230, 118, 0.1)',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  confidenceText: {
    color: COLORS.success,
    fontSize: 10,
    fontWeight: '700',
  },
});
