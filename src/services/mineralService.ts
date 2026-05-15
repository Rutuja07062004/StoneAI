import AsyncStorage from '@react-native-async-storage/async-storage';
import { Mineral } from '../types/mineral';
import { MINERALS } from '../data/minerals';

const FAVORITES_KEY = '@stoneai_favorites';

export const mineralService = {
  /**
   * Get all minerals from the local database
   */
  async getAllMinerals(): Promise<Mineral[]> {
    // We cast to any because the local data 'image' is a require() number, 
    // while the type might expect a string.
    return MINERALS as any;
  },

  /**
   * Get a single mineral by ID
   */
  async getMineralById(id: string): Promise<Mineral | undefined> {
    return (MINERALS as any).find((m: any) => m.id === id);
  },

  /**
   * Get favorite mineral IDs from local storage
   */
  getFavorites: async (): Promise<string[]> => {
    try {
      const favorites = await AsyncStorage.getItem(FAVORITES_KEY);
      return favorites ? JSON.parse(favorites) : [];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return [];
    }
  },

  /**
   * Toggle a mineral ID in favorites
   */
  toggleFavorite: async (id: string): Promise<string[]> => {
    try {
      const favorites = await mineralService.getFavorites();
      const isFavorite = favorites.includes(id);
      
      let newFavorites;
      if (isFavorite) {
        newFavorites = favorites.filter(favId => favId !== id);
      } else {
        newFavorites = [...favorites, id];
      }
      
      await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
      return newFavorites;
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return [];
    }
  },

  /**
   * Check if a mineral is in favorites
   */
  isFavorite: async (id: string): Promise<boolean> => {
    const favorites = await mineralService.getFavorites();
    return favorites.includes(id);
  }
};
