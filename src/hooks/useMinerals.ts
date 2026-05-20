import { useState, useEffect, useMemo } from 'react';
import { Mineral, MineralCategory } from '../types/mineral';
import { mineralService } from '../services/mineralService';
import { mineralApiService } from '../services/mineralApiService';

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
  const [error, setError] = useState<string | null>(null);
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
    setError(null);
    try {
      const [fetchedMinerals, favs] = await Promise.all([
        mineralApiService.getAllMinerals(),
        mineralService.getFavorites(),
      ]);
      setMinerals(fetchedMinerals);
      setFavorites(favs);
    } catch (err: any) {
      console.error('Error loading minerals from API:', err?.message);
      setError('Could not connect to server.');
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
        !searchQuery ||
        mineral.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mineral.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mineral.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mineral.subCategory.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        selectedCategory === 'All' || mineral.category === selectedCategory;

      const matchesRarity =
        activeFilters.rarity.length === 0 ||
        activeFilters.rarity.includes(mineral.rarity);

      const matchesHardness =
        activeFilters.hardness.length === 0 ||
        activeFilters.hardness.some(range => {
          const [min, max] = range.split('-').map(Number);
          const val = typeof mineral.hardness === 'number' ? mineral.hardness : parseFloat(mineral.hardness);
          return !isNaN(val) && val >= min && (max ? val <= max : true);
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
    error,
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
    refresh: loadData,
  };
};
