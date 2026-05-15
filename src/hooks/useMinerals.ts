import { useState, useEffect, useMemo } from 'react';
import { Mineral, MineralCategory } from '../types/mineral';
import { mineralService } from '../services/mineralService';
import { MINERALS } from '../data/minerals';

const CATEGORIES: (MineralCategory | 'All')[] = [
  'All',
  'Crystals',
  'Minerals',
  'Gemstones',
  'Igneous Rocks',
  'Sedimentary Rocks',
  'Metamorphic Rocks',
];

export const useMinerals = () => {
  const [minerals, setMinerals] = useState<Mineral[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MineralCategory | 'All'>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeFilters, setActiveFilters] = useState<{
    rarity: string[];
    hardness: string[];
  }>({
    rarity: [],
    hardness: [],
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Use local MINERALS as the base data
      const favs = await mineralService.getFavorites();
      setMinerals(MINERALS as any);
      setFavorites(favs);
    } catch (error) {
      console.error('Error loading minerals:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = async (id: string) => {
    const newFavs = await mineralService.toggleFavorite(id);
    setFavorites(newFavs);
  };

  const filteredMinerals = useMemo(() => {
    return minerals.filter(mineral => {
      const matchesSearch = 
        mineral.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mineral.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mineral.type.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || mineral.category === selectedCategory;
      
      const matchesRarity = 
        activeFilters.rarity.length === 0 || 
        activeFilters.rarity.includes(mineral.rarity);
      
      const matchesHardness = 
        activeFilters.hardness.length === 0 || 
        activeFilters.hardness.some(range => {
          const [min, max] = range.split('-').map(Number);
          const val = parseFloat(mineral.hardness);
          return val >= min && (max ? val <= max : true);
        });
      
      return matchesSearch && matchesCategory && matchesRarity && matchesHardness;
    });
  }, [minerals, searchQuery, selectedCategory, activeFilters]);

  const updateFilter = (key: 'rarity' | 'hardness', value: string) => {
    setActiveFilters(prev => {
      const current = prev[key];
      const next = current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value];
      return { ...prev, [key]: next };
    });
  };

  const resetFilters = () => {
    setActiveFilters({ rarity: [], hardness: [] });
    setSelectedCategory('All');
    setSearchQuery('');
  };

  const favoriteMinerals = useMemo(() => {
    return minerals.filter(m => favorites.includes(m.id));
  }, [minerals, favorites]);

  return {
    minerals: filteredMinerals,
    allMinerals: minerals,
    favoriteMinerals,
    favorites,
    loading,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    viewMode,
    setViewMode,
    activeFilters,
    updateFilter,
    resetFilters,
    toggleFavorite,
    categories: CATEGORIES,
    refresh: loadData
  };
};
