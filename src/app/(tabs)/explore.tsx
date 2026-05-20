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
  LayoutGrid, 
  List, 
  Filter,
  Bookmark,
  Sparkles,
  Info
} from 'lucide-react-native';
import { COLORS, SIZES } from '@/constants/theme';
import { useMinerals } from '@/hooks/useMinerals';
import { MineralCard } from '@/components/minerals/MineralCard';
import { CategoryCarousel } from '@/components/minerals/CategoryCarousel';
import { FilterModal } from '@/components/minerals/FilterModal';

const { width } = Dimensions.get('window');

export default function ExploreScreen() {
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
    resetFilters,
    categories
  } = useMinerals();

  const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const displayMinerals = showOnlyFavorites 
    ? minerals.filter(m => favorites.includes(m.id))
    : minerals;

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.title}>Field Guide</Text>
          <Text style={styles.subtitle}>Mineral Encyclopedia</Text>
        </View>
        <View style={styles.topActions}>
          <TouchableOpacity 
            onPress={() => setShowOnlyFavorites(!showOnlyFavorites)}
            style={[styles.actionBtn, showOnlyFavorites && styles.activeActionBtn]}
          >
            <Bookmark 
              size={20} 
              color={showOnlyFavorites ? COLORS.primary : "#FFFFFF"} 
              fill={showOnlyFavorites ? COLORS.primary : "transparent"}
            />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <Info size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color={COLORS.textMuted} />
          <TextInput
            placeholder="Search 500+ specimens..."
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

      {/* Trending Section - Premium Horizontal Scroll */}
      {selectedCategory === 'All' && !searchQuery && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Specimens</Text>
            <TouchableOpacity onPress={() => setSelectedCategory('Minerals')}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={minerals.filter(m => m.trending)}
            keyExtractor={item => `trending-${item.id}`}
            renderItem={({ item, index }) => (
              <MineralCard
                mineral={item}
                index={index}
                viewMode="grid"
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={(m) => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
                customStyle={styles.trendingCard}
              />
            )}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}

      {/* Gemstone Featured Section */}
      {selectedCategory === 'Gemstones' && !searchQuery && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Rare Gemstones</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={minerals.filter(m => m.category === 'Gemstones' && m.trending)}
            keyExtractor={item => `featured-gem-${item.id}`}
            renderItem={({ item, index }) => (
              <MineralCard
                mineral={item}
                index={index}
                viewMode="grid"
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={(m) => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
                customStyle={styles.gemTrendingCard}
              />
            )}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}

      {/* Igneous Featured Section */}
      {selectedCategory === 'Igneous Rocks' && !searchQuery && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Volcanic Specimens</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={minerals.filter(m => m.category === 'Igneous Rocks' && m.trending)}
            keyExtractor={item => `featured-ign-${item.id}`}
            renderItem={({ item, index }) => (
              <MineralCard
                mineral={item}
                index={index}
                viewMode="grid"
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={(m) => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
                customStyle={styles.igneousTrendingCard}
              />
            )}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}

      {/* Sedimentary Featured Section */}
      {selectedCategory === 'Sedimentary Rocks' && !searchQuery && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Earthy Formations</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={minerals.filter(m => m.category === 'Sedimentary Rocks' && m.trending)}
            keyExtractor={item => `featured-sed-${item.id}`}
            renderItem={({ item, index }) => (
              <MineralCard
                mineral={item}
                index={index}
                viewMode="grid"
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={(m) => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
                customStyle={styles.sedimentaryTrendingCard}
              />
            )}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}

      {/* Metamorphic Featured Section */}
      {selectedCategory === 'Metamorphic Rocks' && !searchQuery && (
        <View style={styles.trendingSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Transformed Specimens</Text>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={minerals.filter(m => m.category === 'Metamorphic Rocks' && m.trending)}
            keyExtractor={item => `featured-meta-${item.id}`}
            renderItem={({ item, index }) => (
              <MineralCard
                mineral={item}
                index={index}
                viewMode="grid"
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
                onPress={(m) => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
                customStyle={styles.metamorphicTrendingCard}
              />
            )}
            contentContainerStyle={styles.trendingList}
          />
        </View>
      )}

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

    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Sparkles size={48} color={COLORS.textMuted} />
      <Text style={styles.emptyTitle}>No specimens found</Text>
      <Text style={styles.emptySubtitle}>
        Try adjusting your filters or search terms.
      </Text>
      <TouchableOpacity 
        style={styles.resetButton}
        onPress={resetFilters}
      >
        <Text style={styles.resetButtonText}>Reset All Filters</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient
        colors={[COLORS.background, '#0A0A0A']}
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
          key={viewMode}
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
  title: {
    fontSize: 28,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '600',
    marginTop: -2,
  },
  topActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.05)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  activeActionBtn: {
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
    fontSize: 15,
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
  },
  trendingSection: {
    marginTop: 16,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  seeAllText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  trendingList: {
    paddingLeft: 16,
    paddingRight: 8,
    paddingBottom: 16,
  },
  trendingCard: {
    width: 200,
    marginRight: 12,
  },
  gemTrendingCard: {
    width: 240,
    marginRight: 16,
    height: 180,
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderWidth: 1.5,
  },
  igneousTrendingCard: {
    width: 220,
    marginRight: 12,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 1,
  },
  sedimentaryTrendingCard: {
    width: 220,
    marginRight: 12,
    borderColor: 'rgba(139, 69, 19, 0.3)',
    borderWidth: 1,
  },
  metamorphicTrendingCard: {
    width: 220,
    marginRight: 12,
    borderColor: 'rgba(0, 255, 255, 0.2)',
    borderWidth: 1,
  }
});
