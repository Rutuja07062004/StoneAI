import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions, 
  Platform, 
  Share,
  StatusBar
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  FadeInDown, 
  FadeInRight,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate
} from 'react-native-reanimated';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  MapPin, 
  Layers, 
  Ruler, 
  Sparkles, 
  ChevronRight,
  History,
  Info,
  DollarSign,
  Box,
  Lightbulb,
  Gem
} from 'lucide-react-native';
import { mineralService } from '../../services/mineralService';
import { mineralApiService } from '../../services/mineralApiService';
import { Mineral } from '../../types/mineral';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import { getMineralImage } from '../../utils/getMineralImage';

const { width } = Dimensions.get('window');
const HEADER_HEIGHT = 450;



export default function MineralDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  const [mineral, setMineral] = useState<Mineral | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [relatedMinerals, setRelatedMinerals] = useState<Mineral[]>([]);
  const scrollY = useSharedValue(0);

  useEffect(() => {
    if (id) {
      loadMineral();
    }
  }, [id]);

  const loadMineral = async () => {
    try {
      const data = await mineralApiService.getMineralById(id);
      if (data) {
        setMineral(data);
        const isFav = await mineralService.isFavorite(id);
        setIsFavorite(isFav);
        
        // Use API to get related minerals
        const related = await mineralApiService.getMineralsByCategory(data.category);
        setRelatedMinerals(related.filter(m => m.id !== id).slice(0, 5));
      }
    } catch (error) {
      console.error('Failed to load mineral details:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!id) return;
    const res = await mineralService.toggleFavorite(id);
    setIsFavorite(res.includes(id));
  };

  const handleShare = async () => {
    if (!mineral) return;
    try {
      await Share.share({
        message: `Discover ${mineral.name} on StoneAI! It's a ${mineral.rarity} ${mineral.subCategory} with a Mohs hardness of ${mineral.hardness}.`,
      });
    } catch (e) {
      console.error(e);
    }
  };

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollY.value = event.contentOffset.y;
  });

  const headerImageStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]
          ),
        },
        {
          scale: interpolate(
            scrollY.value,
            [-HEADER_HEIGHT, 0, HEADER_HEIGHT],
            [2, 1, 1]
          ),
        },
      ],
    };
  });

  if (!mineral) return (
    <View style={styles.loadingContainer}>
      <LinearGradient colors={[COLORS.background, '#121212']} style={StyleSheet.absoluteFill} />
      <StatusBar barStyle="light-content" />
      <Text style={styles.loadingText}>Loading specimen...</Text>
    </View>
  );

  const localAsset = getMineralImage(mineral.category, mineral.imageKey, mineral.hasRealImage, mineral.name);

  const getCategoryGradient = (category: string): readonly [string, string, string] => {
    switch (category) {
      case 'Crystals': return ['#140727', '#42155c', '#050505']; // cosmic purple & deep amethyst
      case 'Minerals': return ['#1a1d20', '#3b4046', '#050505']; // premium silver, gray, graphite
      case 'Gemstones': return ['#4a0404', '#9e7a28', '#050505']; // royal gold & ruby red luxury
      case 'Igneous Rocks':
      case 'Igneous': return ['#100502', '#2a0902', '#050505']; // volcanic dark obsidian & lava ember
      case 'Sedimentary Rocks':
      case 'Sedimentary': return ['#22160b', '#3d2510', '#050505']; // earthy clay, sandstone brown
      case 'Metamorphic Rocks':
      case 'Metamorphic': return ['#06101d', '#132c4a', '#050505']; // deep layered slate, metamorphic blue
      default: return ['#121212', '#262626', '#050505'];
    }
  };

  const gradient = getCategoryGradient(mineral.category);
  const initials = mineral.name.substring(0, 2).toUpperCase();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      
      <Animated.ScrollView
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Hero Section */}
        <View style={styles.heroWrapper}>
          <Animated.View style={[styles.heroContainer, headerImageStyle]}>
            {localAsset ? (
              <Image 
                source={localAsset} 
                style={styles.heroImage} 
                contentFit="cover"
              />
            ) : (
              <LinearGradient colors={gradient} style={[styles.heroImage, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'rgba(255,255,255,0.05)', fontSize: 120, fontWeight: '900', position: 'absolute' }}>
                  {initials}
                </Text>
                <Gem size={80} color="rgba(255,255,255,0.4)" />
              </LinearGradient>
            )}
            <LinearGradient
              colors={['rgba(0,0,0,0.4)', 'transparent', 'rgba(5,5,5,1)']}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>

          <View style={styles.heroContent}>
            <Animated.View entering={FadeInDown.delay(200).duration(600)}>
              <View style={styles.rarityBadge}>
                <Sparkles size={12} color={COLORS.background} />
                <Text style={styles.rarityText}>{mineral.rarity.toUpperCase()}</Text>
              </View>
              <Text style={styles.mineralName}>{mineral.name}</Text>
              <Text style={styles.mineralCategory}>{mineral.category} • {mineral.subCategory}</Text>
            </Animated.View>
          </View>
        </View>

        <View style={styles.mainContent}>
          {/* Quick Stats */}
          <Animated.View entering={FadeInDown.delay(400).duration(600)} style={styles.statsRow}>
            <View style={styles.statBox}>
              <View style={styles.statIconWrapper}>
                <Ruler size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statVal}>{mineral.hardness}</Text>
              <Text style={styles.statLabel}>Hardness</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={styles.statIconWrapper}>
                <MapPin size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statVal}>{mineral.origin?.split(',')[0] || 'Unknown'}</Text>
              <Text style={styles.statLabel}>Origin</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <View style={styles.statIconWrapper}>
                <Layers size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.statVal}>Unknown</Text>
              <Text style={styles.statLabel}>Formula</Text>
            </View>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={FadeInDown.delay(500).duration(600)} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Info size={18} color={COLORS.primary} />
              <Text style={styles.sectionTitle}>Overview</Text>
            </View>
            <Text style={styles.description}>{mineral.description}</Text>
          </Animated.View>

          {/* Details Grid */}
          <Animated.View entering={FadeInDown.delay(600).duration(600)} style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Chemical Composition</Text>
              <Text style={styles.detailValue}>Various Complex Elements</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Common Colors</Text>
              <Text style={styles.detailValue}>Various</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Uses & Applications</Text>
              <Text style={styles.detailValue}>{mineral.uses}</Text>
            </View>
          </Animated.View>

          {/* Market Value Section */}
          <Animated.View entering={FadeInDown.delay(700).duration(600)} style={styles.marketCard}>
            <LinearGradient
              colors={['rgba(212, 175, 55, 0.1)', 'rgba(212, 175, 55, 0.02)']}
              style={styles.marketGradient}
            />
            <View style={styles.marketHeader}>
              <DollarSign size={20} color={COLORS.primary} />
              <Text style={styles.marketTitle}>Market Valuation</Text>
            </View>
            <Text style={styles.marketPrice}>Varies</Text>
            <Text style={styles.marketDisclaimer}>
              Values are estimates based on specimen quality and rarity.
            </Text>
          </Animated.View>

          {/* Fun Facts & History */}
          <View style={styles.row}>
            <Animated.View entering={FadeInRight.delay(800).duration(600)} style={[styles.infoTile, { flex: 1 }]}>
              <History size={18} color={COLORS.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.tileTitle}>History</Text>
              <Text style={styles.tileText}>A prominent specimen in early historical records.</Text>
            </Animated.View>
            <Animated.View entering={FadeInRight.delay(900).duration(600)} style={[styles.infoTile, { flex: 1 }]}>
              <Lightbulb size={18} color={COLORS.primary} style={{ marginBottom: 8 }} />
              <Text style={styles.tileTitle}>Fun Fact</Text>
              <Text style={styles.tileText}>Possesses unique crystalline structures at the microscopic level.</Text>
            </Animated.View>
          </View>

          {/* Related Minerals */}
          {relatedMinerals.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.sectionTitle}>Related Specimens</Text>
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.relatedScroll}
              >
                {relatedMinerals.map((m, index) => {
                  const mLocalAsset = getMineralImage(m.category, m.imageKey, m.hasRealImage, m.name);
                  const mInitials = m.name.substring(0, 2).toUpperCase();
                  const mGradient = getCategoryGradient(m.category).slice(0, 2) as [string, string];
                  
                  return (
                    <TouchableOpacity 
                      key={m.id} 
                      onPress={() => router.push({ pathname: '/guide/[id]', params: { id: m.id } })}
                      style={styles.relatedCard}
                    >
                      {mLocalAsset ? (
                        <Image 
                          source={mLocalAsset} 
                          style={styles.relatedImg} 
                          contentFit="cover" 
                        />
                      ) : (
                        <LinearGradient colors={mGradient} style={[styles.relatedImg, { justifyContent: 'center', alignItems: 'center' }]}>
                           <Text style={{ color: 'rgba(255,255,255,0.1)', fontSize: 32, fontWeight: '900', position: 'absolute' }}>{mInitials}</Text>
                           <Gem size={24} color="rgba(255,255,255,0.5)" />
                        </LinearGradient>
                      )}
                      <Text style={styles.relatedName} numberOfLines={1}>{m.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={{ height: 120 }} />
        </View>
      </Animated.ScrollView>

      {/* Floating Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconBtn}>
          <BlurView intensity={20} tint="dark" style={styles.blurBtn}>
            <ArrowLeft color="#fff" size={22} />
          </BlurView>
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleShare} style={styles.iconBtn}>
            <BlurView intensity={20} tint="dark" style={styles.blurBtn}>
              <Share2 color="#fff" size={20} />
            </BlurView>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleToggleFavorite} style={styles.iconBtn}>
            <BlurView intensity={20} tint="dark" style={styles.blurBtn}>
              <Heart 
                color={isFavorite ? COLORS.primary : "#fff"} 
                fill={isFavorite ? COLORS.primary : "transparent"} 
                size={20} 
              />
            </BlurView>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: COLORS.primary,
    fontWeight: 'bold',
    marginTop: 20,
  },
  scrollContent: {
    paddingBottom: 0,
  },
  heroWrapper: {
    height: HEADER_HEIGHT,
    overflow: 'hidden',
  },
  heroContainer: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroContent: {
    position: 'absolute',
    bottom: 40,
    left: 24,
    right: 24,
  },
  rarityBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    marginBottom: 16,
    ...SHADOWS.gold,
  },
  rarityText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '900',
    letterSpacing: 1,
  },
  mineralName: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: -1,
  },
  mineralCategory: {
    color: COLORS.textSecondary,
    fontSize: 16,
    fontWeight: '600',
    marginTop: 4,
  },
  header: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 60 : 40,
    left: 20,
    right: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 100,
  },
  iconBtn: {
    borderRadius: 22,
    overflow: 'hidden',
  },
  blurBtn: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  mainContent: {
    backgroundColor: '#050505',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: -30,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 24,
    paddingVertical: 20,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 32,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statVal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
  },
  statLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 15,
    lineHeight: 24,
  },
  detailsCard: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    marginBottom: 24,
  },
  detailRow: {
    paddingVertical: 12,
  },
  detailLabel: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  detailDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  marketCard: {
    padding: 24,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(212, 175, 55, 0.2)',
  },
  marketGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  marketHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 12,
  },
  marketTitle: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  marketPrice: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 8,
  },
  marketDisclaimer: {
    color: COLORS.textMuted,
    fontSize: 11,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 32,
  },
  infoTile: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  tileTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tileText: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 18,
  },
  relatedSection: {
    marginTop: 16,
  },
  relatedScroll: {
    paddingVertical: 16,
    gap: 16,
  },
  relatedCard: {
    width: 140,
  },
  relatedImg: {
    width: 140,
    height: 140,
    borderRadius: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  relatedName: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    textAlign: 'center',
  },
});
