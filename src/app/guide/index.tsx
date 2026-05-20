import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  TextInput, 
  TouchableOpacity, 
  ActivityIndicator,
  StatusBar,
  Dimensions
} from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { 
  Search, 
  ArrowLeft, 
  LayoutGrid, 
  List, 
  Filter,
  Bookmark,
  TrendingUp,
  Sparkles
} from 'lucide-react-native';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { useMinerals } from '../../hooks/useMinerals';
import { MineralCard } from '../../components/minerals/MineralCard';
import { CategoryCarousel } from '../../components/minerals/CategoryCarousel';
import { FilterModal } from '../../components/minerals/FilterModal';
import { Mineral } from '../../types/mineral';

const { width } = Dimensions.get('window');

export default function FieldGuideScreen() {
  const router = useRouter();
  const {
    minerals,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    favorites,
    toggleFavorite,
    activeFilters,
    updateFilter,
    resetFilters
  } = useMinerals();

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const displayMinerals = showOnlyFavorites 
    ? minerals.filter(m => favorites.includes(m.id))
    : minerals;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <TouchableOpacity 
          onPress={() => router.back()} 
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Encyclopedia</Text>
        <TouchableOpacity 
          onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
          style={[styles.favoriteToggle, showOnlyFavorites && styles.activeFavoriteToggle]}
        >
          <Bookmark 
            size={20} 
            color={showOnlyFavorites ? COLORS.primary : "#FFFFFF"} 
            fill={showOnlyFavorites ? COLORS.primary : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search minerals, crystals..."
            placeholderTextColor={COLORS.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={styles.searchInput}
          />
          <TouchableOpacity 
            style={[
              styles.filterButton, 
              (activeFilters.rarity.length > 0 || activeFilters.hardness.length > 0) && styles.activeFilterBtn
            ]}
            onPress={() => setFilterModalVisible(true)}
          >
            <Filter size={18} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
      </View>

      <CategoryCarousel 
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <View style={styles.listHeader}>
        <View style={styles.headerInfo}>
          <Text style={styles.resultsCount}>
            {displayMinerals.length} Specimens Found
          </Text>
        </View>
        <View style={styles.viewToggles}>
          <TouchableOpacity 
            onPress={() => setViewMode('grid')}
            style={[styles.toggleBtn, viewMode === 'grid' && styles.activeToggle]}
          >
            <LayoutGrid size={18} color={viewMode === 'grid' ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setViewMode('list')}
            style={[styles.toggleBtn, viewMode === 'list' && styles.activeToggle]}
          >
            <List size={18} color={viewMode === 'list' ? COLORS.primary : COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {!searchQuery && !showOnlyFavorites && selectedCategory === 'All' && (
        <View style={styles.featuredSection}>
          <View style={styles.sectionHeader}>
            <TrendingUp size={16} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Trending Now</Text>
          </View>
        </View>
      )}
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Sparkles size={48} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No specimens found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search terms to find what you're looking for.
      </Text>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={() => {
          setSearchQuery('');
          setSelectedCategory('All');
          setShowOnlyFavorites(false);
        }}
      >
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.background, '#121212']}
        style={StyleSheet.absoluteFill}
      />
      
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>Unearthing specimens...</Text>
        </View>
      ) : (
        <FlatList
          data={displayMinerals}
          keyExtractor={(item) => item.id}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when switching layouts
          renderItem={({ item, index }) => (
            <MineralCard
              mineral={item}
              index={index}
              viewMode={viewMode}
              isFavorite={favorites.includes(item.id)}
              onToggleFavorite={toggleFavorite}
              onPress={(m) => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
            />
          )}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={renderEmptyState}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          initialNumToRender={8}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews={true}
        />
      )}

      <FilterModal
        visible={filterModalVisible}
        onClose={() => setFilterModalVisible(false)}
        filters={activeFilters}
        onUpdateFilters={updateFilter}
        onReset={resetFilters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.textSecondary,
    marginTop: 16,
    fontSize: 14,
    letterSpacing: 1,
  },
  headerContainer: {
    paddingTop: 60,
    paddingBottom: 8,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  favoriteToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeFavoriteToggle: {
    borderColor: COLORS.primary,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
  },
  searchSection: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    color: '#FFFFFF',
    fontSize: 16,
  },
  filterButton: {
    padding: 8,
  },
  activeFilterBtn: {
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 8,
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  headerInfo: {
    flex: 1,
  },
  resultsCount: {
    color: COLORS.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  viewToggles: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 4,
    gap: 4,
  },
  toggleBtn: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  activeToggle: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
  },
  listContent: {
    paddingBottom: 40,
  },
  featuredSection: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    color: COLORS.primary,
    fontSize: 14,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtitle: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  resetButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  resetButtonText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  }
});
