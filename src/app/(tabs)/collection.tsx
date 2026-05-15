import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Dimensions, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useFocusEffect } from 'expo-router';
import { COLORS, SIZES } from '@/constants/theme';
import { GlassCard } from '@/components/ui/GlassCard';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Filter, LayoutGrid, List, Plus, TrendingUp, Trophy, Gem, Sparkles, AlertCircle, MapPin } from 'lucide-react-native';
import { storageService, CollectionItem } from '@/services/storageService';

const { width } = Dimensions.get('window');

export default function CollectionScreen() {
  const router = useRouter();
  const [items, setItems] = useState<CollectionItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<CollectionItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const fetchCollection = async () => {
    setIsLoading(true);
    const data = await storageService.getCollection();
    setItems(data);
    setFilteredItems(data);
    setIsLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchCollection();
    }, [])
  );

  useEffect(() => {
    const filtered = items.filter(item => 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredItems(filtered);
  }, [searchQuery, items]);

  const totalValue = items.reduce((acc, item) => {
    const val = parseInt(item.value.replace(/[^0-9]/g, '')) || 0;
    return acc + val;
  }, 0);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[COLORS.background, '#121212']}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Vault</Text>
          <Text style={styles.subtitle}>Geological Discovery Journal</Text>
        </View>
        <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/scan')}>
          <Plus size={24} color={COLORS.background} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Collection Stats */}
        <View style={styles.statsRow}>
          <GlassCard style={styles.statCard}>
            <Trophy size={20} color={COLORS.primary} />
            <Text style={styles.statValue}>{items.length}</Text>
            <Text style={styles.statLabel}>Specimens</Text>
          </GlassCard>
          <GlassCard style={styles.statCard}>
            <TrendingUp size={20} color={COLORS.success} />
            <Text style={styles.statValue}>${(totalValue / 1000).toFixed(1)}k</Text>
            <Text style={styles.statLabel}>Est. Value</Text>
          </GlassCard>
        </View>

        {/* Search & Filter */}
        <View style={styles.searchRow}>
          <GlassCard style={styles.searchBar}>
            <Search size={18} color={COLORS.textSecondary} />
            <TextInput
              placeholder="Search your vault..."
              placeholderTextColor={COLORS.textMuted}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </GlassCard>
          <TouchableOpacity style={styles.filterBtn}>
            <Filter size={20} color={COLORS.text} />
          </TouchableOpacity>
        </View>

        {items.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconCircle}>
              <Gem size={48} color={COLORS.primary} opacity={0.3} />
              <Sparkles size={24} color={COLORS.primary} style={styles.sparkleIcon} />
            </View>
            <Text style={styles.emptyTitle}>Empty Vault</Text>
            <Text style={styles.emptySub}>Your collection is empty. Start scanning minerals to build your geological journal.</Text>
            <TouchableOpacity style={styles.startBtn} onPress={() => router.push('/scan')}>
              <Text style={styles.startBtnText}>Start Discovering</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.gridHeader}>
              <Text style={styles.gridTitle}>Recent Findings</Text>
              <View style={styles.viewToggle}>
                <TouchableOpacity 
                  style={viewMode === 'grid' ? styles.toggleActive : styles.toggleInactive}
                  onPress={() => setViewMode('grid')}
                >
                  <LayoutGrid size={18} color={viewMode === 'grid' ? COLORS.primary : COLORS.textMuted} />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={viewMode === 'list' ? styles.toggleActive : styles.toggleInactive}
                  onPress={() => setViewMode('list')}
                >
                  <List size={18} color={viewMode === 'list' ? COLORS.primary : COLORS.textMuted} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={viewMode === 'grid' ? styles.grid : styles.list}>
              {filteredItems.map((item) => (
                <TouchableOpacity 
                  key={item.id} 
                  style={viewMode === 'grid' ? styles.gridItem : styles.listItem}
                  onPress={() => router.push({ pathname: '/collection/[id]', params: { id: item.id } })}
                >
                  <GlassCard style={styles.card} padding={0}>
                    <Image 
                      source={{ uri: item.imageUri }} 
                      style={viewMode === 'grid' ? styles.cardImage : styles.listImage} 
                      contentFit="cover"
                    />
                    <View style={styles.cardInfo}>
                      <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                      <View style={styles.cardMeta}>
                        <Text style={styles.cardType}>{item.structure} Sys.</Text>
                        <View style={styles.dot} />
                        <Text style={styles.cardDate}>
                          {new Date(item.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </Text>
                      </View>
                      
                      {item.location?.address && (
                        <View style={styles.locationRow}>
                          <MapPin size={10} color={COLORS.primary} />
                          <Text style={styles.locationText} numberOfLines={1}>
                            {item.location.city || item.location.address}
                          </Text>
                        </View>
                      )}
                      
                      <Text style={styles.cardValue}>{item.value.split(' ')[0]}</Text>
                    </View>
                  </GlassCard>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingHorizontal: SIZES.padding, marginBottom: SIZES.large,
  },
  title: { color: COLORS.text, fontSize: 28, fontWeight: '900', letterSpacing: -0.5 },
  subtitle: { color: COLORS.textSecondary, fontSize: 13, fontWeight: '600', marginTop: -2 },
  addBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: COLORS.primary, justifyContent: 'center', alignItems: 'center',
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8,
  },
  scrollContent: { paddingHorizontal: 16 },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, paddingVertical: 16, alignItems: 'center' },
  statValue: { color: COLORS.text, fontSize: 22, fontWeight: '800', marginTop: 4 },
  statLabel: { color: COLORS.textSecondary, fontSize: 11, fontWeight: '600', textTransform: 'uppercase' },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  searchBar: { flex: 1, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50 },
  searchInput: { flex: 1, marginLeft: 10, color: COLORS.text, fontSize: 15 },
  filterBtn: {
    width: 50, height: 50, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.05)', justifyContent: 'center', alignItems: 'center',
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
  },
  gridHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  gridTitle: { color: COLORS.text, fontSize: 18, fontWeight: '800' },
  viewToggle: { flexDirection: 'row', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 10, padding: 4 },
  toggleActive: { backgroundColor: 'rgba(255, 255, 255, 0.1)', padding: 6, borderRadius: 8 },
  toggleInactive: { padding: 6 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  gridItem: { width: (width - 44) / 2, marginBottom: 16 },
  list: { gap: 12 },
  listItem: { width: '100%' },
  card: { overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)' },
  cardImage: { width: '100%', height: 120 },
  listImage: { width: 100, height: '100%' },
  cardInfo: { padding: 12 },
  cardName: { color: COLORS.text, fontSize: 15, fontWeight: '700', marginBottom: 2 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  cardType: { color: COLORS.textSecondary, fontSize: 11 },
  dot: { width: 3, height: 3, borderRadius: 1.5, backgroundColor: COLORS.textMuted },
  cardDate: { color: COLORS.textMuted, fontSize: 11 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  locationText: { color: COLORS.textSecondary, fontSize: 10, fontWeight: '600' },
  cardValue: { color: COLORS.primary, fontWeight: '800', fontSize: 13 },
  emptyState: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyIconCircle: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: 'rgba(255,215,0,0.05)', justifyContent: 'center', alignItems: 'center',
    marginBottom: 24, borderStyle: 'dashed', borderWidth: 1, borderColor: 'rgba(255,215,0,0.2)',
  },
  sparkleIcon: { position: 'absolute', top: 10, right: 10 },
  emptyTitle: { color: COLORS.text, fontSize: 22, fontWeight: '900', marginBottom: 12 },
  emptySub: { color: COLORS.textSecondary, fontSize: 15, textAlign: 'center', lineHeight: 22, marginBottom: 30 },
  startBtn: {
    backgroundColor: COLORS.primary, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 30,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  startBtnText: { color: COLORS.background, fontWeight: '900', fontSize: 15 },
});
