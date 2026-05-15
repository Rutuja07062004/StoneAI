import AsyncStorage from '@react-native-async-storage/async-storage';
import type { GeminiMineralResult } from './geminiService';

const COLLECTION_KEY = '@stone_ai_collection';

export interface CollectionItem extends GeminiMineralResult {
  id: string;
  imageUri: string;
  notes: string;
  location?: {
    latitude: number;
    longitude: number;
    address?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  createdAt: string;
  isFavorite: boolean;
}

export const storageService = {
  /**
   * Get all items in the collection
   */
  getCollection: async (): Promise<CollectionItem[]> => {
    try {
      const data = await AsyncStorage.getItem(COLLECTION_KEY);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error('Failed to fetch collection', e);
      return [];
    }
  },

  /**
   * Save a new item to the collection
   */
  saveItem: async (item: Omit<CollectionItem, 'id' | 'createdAt' | 'isFavorite'>): Promise<CollectionItem> => {
    try {
      const collection = await storageService.getCollection();
      
      const newItem: CollectionItem = {
        ...item,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        isFavorite: false,
      };

      const updatedCollection = [newItem, ...collection];
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
      return newItem;
    } catch (e) {
      console.error('Failed to save item', e);
      throw e;
    }
  },

  /**
   * Update an existing item
   */
  updateItem: async (id: string, updates: Partial<CollectionItem>): Promise<void> => {
    try {
      const collection = await storageService.getCollection();
      const updatedCollection = collection.map(item => 
        item.id === id ? { ...item, ...updates } : item
      );
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
    } catch (e) {
      console.error('Failed to update item', e);
    }
  },

  /**
   * Remove an item from the collection
   */
  removeItem: async (id: string): Promise<void> => {
    try {
      const collection = await storageService.getCollection();
      const updatedCollection = collection.filter(item => item.id !== id);
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
    } catch (e) {
      console.error('Failed to remove item', e);
    }
  },

  /**
   * Toggle favorite status
   */
  toggleFavorite: async (id: string): Promise<boolean> => {
    try {
      const collection = await storageService.getCollection();
      let newStatus = false;
      const updatedCollection = collection.map(item => {
        if (item.id === id) {
          newStatus = !item.isFavorite;
          return { ...item, isFavorite: newStatus };
        }
        return item;
      });
      await AsyncStorage.setItem(COLLECTION_KEY, JSON.stringify(updatedCollection));
      return newStatus;
    } catch (e) {
      console.error('Failed to toggle favorite', e);
      return false;
    }
  }
};
