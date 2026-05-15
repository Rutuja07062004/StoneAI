import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Image } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Heart, Diamond, Info } from 'lucide-react-native';
import { Mineral } from '../../types/mineral';
import { COLORS, SIZES, SHADOWS } from '../../constants/theme';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { getMineralImage } from '../../constants/mineralImages';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width / 2 - 24;

const getMineralTint = (name: string): string | undefined => {
  const n = name.toLowerCase();
  if (n.includes('amethyst')) return 'rgba(155, 89, 182, 0.4)';
  if (n.includes('ruby')) return 'rgba(231, 76, 60, 0.4)';
  if (n.includes('sapphire')) return 'rgba(52, 152, 219, 0.4)';
  if (n.includes('emerald')) return 'rgba(46, 204, 113, 0.4)';
  if (n.includes('rose quartz')) return 'rgba(255, 192, 203, 0.4)';
  if (n.includes('citrine')) return 'rgba(241, 196, 15, 0.3)';
  if (n.includes('obsidian')) return 'rgba(0, 0, 0, 0.5)';
  return undefined;
};

interface MineralCardProps {
  mineral: Mineral;
  onPress: (mineral: Mineral) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  index: number;
  viewMode: 'grid' | 'list';
  customStyle?: any;
}

export const MineralCard: React.FC<MineralCardProps> = ({
  mineral,
  onPress,
  isFavorite,
  onToggleFavorite,
  index,
  viewMode,
  customStyle
}) => {
  const isList = viewMode === 'list';

  return (
    <Animated.View 
      entering={FadeInDown.delay(index * 100).duration(500)}
      style={isList ? styles.listContainer : styles.gridContainer}
    >
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => onPress(mineral)}
        style={[styles.card, customStyle]}
      >
        <View style={[isList ? styles.listImageContainer : styles.gridImageContainer, { backgroundColor: '#0A0A0A' }]}>
          <Image
            source={getMineralImage(mineral.imageKey)}
            style={styles.fullImage}
            resizeMode="cover"
          />
        </View>
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.gradient}
        />

        <TouchableOpacity 
          style={styles.favoriteButton}
          onPress={() => onToggleFavorite(mineral.id)}
        >
          <BlurView intensity={20} tint="dark" style={styles.favoriteBlur}>
            <Heart 
              size={18} 
              color={isFavorite ? COLORS.primary : '#FFFFFF'} 
              fill={isFavorite ? COLORS.primary : 'transparent'} 
            />
          </BlurView>
        </TouchableOpacity>

        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.category}>{mineral.category.toUpperCase()}</Text>
            <View style={styles.rarityBadge}>
              <Diamond size={10} color={COLORS.primary} />
              <Text style={styles.rarityText}>{mineral.rarity}</Text>
            </View>
          </View>
          
          <Text style={styles.name} numberOfLines={1}>{mineral.name}</Text>
          
          {isList && (
            <Text style={styles.description} numberOfLines={2}>
              {mineral.description}
            </Text>
          )}

          <View style={styles.footer}>
            <View style={styles.infoItem}>
              <Info size={12} color={COLORS.textMuted} />
              <Text style={styles.infoText}>Hardness: {mineral.hardness}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  gridContainer: {
    width: CARD_WIDTH,
    marginHorizontal: 8,
  },
  listContainer: {
    width: '100%',
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: COLORS.card,
    borderRadius: SIZES.radius,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.glassBorder,
    ...SHADOWS.gold,
  },
  gridImageContainer: {
    width: '100%',
    height: 180,
    backgroundColor: '#1A1A1A',
  },
  listImageContainer: {
    width: '100%',
    height: 200,
    backgroundColor: '#1A1A1A',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '60%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  favoriteBlur: {
    padding: 8,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  content: {
    padding: 12,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  category: {
    color: COLORS.primary,
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rarityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(212, 175, 55, 0.1)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    gap: 4,
  },
  rarityText: {
    color: COLORS.primary,
    fontSize: 9,
    fontWeight: '600',
  },
  name: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  description: {
    color: COLORS.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
