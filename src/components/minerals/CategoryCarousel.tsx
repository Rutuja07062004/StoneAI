import React from 'react';
import { ScrollView, Text, TouchableOpacity, StyleSheet, View } from 'react-native';
import { COLORS, SIZES } from '../../constants/theme';
import { MineralCategory } from '../../types/mineral';

const CATEGORIES: (MineralCategory | 'All')[] = [
  'All',
  'Crystals',
  'Minerals',
  'Gemstones',
  'Igneous Rocks',
  'Sedimentary Rocks',
  'Metamorphic Rocks',
];

interface CategoryCarouselProps {
  selectedCategory: MineralCategory | 'All';
  onSelectCategory: (category: MineralCategory | 'All') => void;
}

export const CategoryCarousel: React.FC<CategoryCarouselProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {CATEGORIES.map((category) => {
          const isActive = selectedCategory === category;
          return (
            <TouchableOpacity
              key={category}
              onPress={() => onSelectCategory(category)}
              style={[
                styles.categoryButton,
                isActive && styles.activeButton
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  isActive && styles.activeText
                ]}
              >
                {category}
              </Text>
              {isActive && <View style={styles.indicator} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  scrollContent: {
    paddingHorizontal: 16,
    gap: 12,
  },
  categoryButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeButton: {
    backgroundColor: 'rgba(212, 175, 55, 0.15)',
    borderColor: COLORS.primary,
  },
  categoryText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '500',
  },
  activeText: {
    color: COLORS.primary,
    fontWeight: 'bold',
  },
  indicator: {
    position: 'absolute',
    bottom: -10,
    left: '50%',
    marginLeft: -2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  }
});
