import api from './api';
import { Mineral, MineralCategory } from '../types/mineral';

// Maps the backend MongoDB document to the frontend Mineral type
const normalizeMineral = (doc: any): Mineral => ({
  id: doc._id || doc.id,
  name: doc.name,
  category: mapCategory(doc.category),
  subCategory: doc.subCategory || 'Mineral',
  hardness: doc.hardness?.toString() || 'N/A',
  rarity: doc.rarity || 'Common',
  description: doc.description,
  origin: doc.origin || 'Unknown',
  uses: Array.isArray(doc.uses) ? doc.uses : (doc.uses ? doc.uses.split(', ') : []),
  featured: doc.featured || false,
  trending: doc.trending || false,
  hasRealImage: doc.hasRealImage || false,
  imageKey: doc.imageKey || 'placeholder',
});

// Map backend category names to frontend MineralCategory type
const mapCategory = (cat: string): MineralCategory => {
  if (['Crystals', 'Minerals', 'Gemstones', 'Igneous Rocks', 'Sedimentary Rocks', 'Metamorphic Rocks'].includes(cat)) {
    return cat as MineralCategory;
  }
  const map: Record<string, MineralCategory> = {
    'Igneous': 'Igneous Rocks',
    'Sedimentary': 'Sedimentary Rocks',
    'Metamorphic': 'Metamorphic Rocks',
  };
  return map[cat] || 'Minerals';
};

import { mineralService } from './mineralService';

export const mineralApiService = {
  /**
   * Fetch all minerals (paginated)
   */
  async getAllMinerals(page = 1, limit = 50): Promise<Mineral[]> {
    try {
      const { data } = await api.get(`/minerals?page=${page}&limit=${limit}`);
      return data.data.map(normalizeMineral);
    } catch (error) {
      console.warn('⚠️ API Connection failed. Falling back to local offline storage.', error);
      const local = await mineralService.getAllMinerals();
      const skip = (page - 1) * limit;
      return local.slice(skip, skip + limit);
    }
  },

  /**
   * Fetch minerals by category
   */
  async getMineralsByCategory(category: string): Promise<Mineral[]> {
    try {
      const backendCategory = reverseMapCategory(category);
      const { data } = await api.get(`/minerals/category/${backendCategory}`);
      return data.data.map(normalizeMineral);
    } catch (error) {
      console.warn('⚠️ API Connection failed. Falling back to local offline storage.', error);
      const local = await mineralService.getAllMinerals();
      return local.filter(m => m.category === category);
    }
  },

  /**
   * Fetch trending minerals
   */
  async getTrendingMinerals(): Promise<Mineral[]> {
    try {
      const { data } = await api.get('/minerals/trending');
      return data.data.map(normalizeMineral);
    } catch (error) {
      console.warn('⚠️ API Connection failed. Falling back to local offline storage.', error);
      const local = await mineralService.getAllMinerals();
      return local.filter(m => m.trending);
    }
  },

  /**
   * Search minerals
   */
  async searchMinerals(query: string): Promise<Mineral[]> {
    try {
      const { data } = await api.get(`/minerals/search?q=${encodeURIComponent(query)}`);
      return data.data.map(normalizeMineral);
    } catch (error) {
      console.warn('⚠️ API Connection failed. Falling back to local offline storage.', error);
      const local = await mineralService.getAllMinerals();
      const q = query.toLowerCase();
      return local.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.description.toLowerCase().includes(q) ||
        m.category.toLowerCase().includes(q) ||
        m.subCategory.toLowerCase().includes(q)
      );
    }
  },

  /**
   * Fetch a single mineral by ID
   */
  async getMineralById(id: string): Promise<Mineral> {
    try {
      const { data } = await api.get(`/minerals/${id}`);
      return normalizeMineral(data.data);
    } catch (error) {
      console.warn('⚠️ API Connection failed. Falling back to local offline storage.', error);
      const local = await mineralService.getMineralById(id);
      if (!local) throw new Error('Specimen not found in offline storage');
      return local;
    }
  },
};

// Reverse map frontend category to backend category name
const reverseMapCategory = (frontendCat: string): string => {
  return frontendCat;
};
