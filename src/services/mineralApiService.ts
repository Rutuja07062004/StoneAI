import api from './api';
import { Mineral, MineralCategory } from '../types/mineral';

// Maps the backend MongoDB document to the frontend Mineral type
const normalizeMineral = (doc: any): Mineral => ({
  id: doc._id,
  name: doc.name,
  category: mapCategory(doc.category),
  type: doc.subCategory || doc.category,
  hardness: doc.hardness?.toString() || 'N/A',
  rarity: doc.rarity || 'Common',
  description: doc.description,
  origin: doc.origin || 'Unknown',
  uses: Array.isArray(doc.uses) ? doc.uses.join(', ') : doc.uses || '',
  image: doc.image || '',
  imageKey: doc.name || '',
  composition: doc.chemicalFormula || '',
  colors: Array.isArray(doc.color) ? doc.color : [],
  marketValue: '',
  funFacts: '',
  history: '',
  isTrending: doc.trending || false,
});

// Map backend category names to frontend MineralCategory type
const mapCategory = (cat: string): MineralCategory => {
  const map: Record<string, MineralCategory> = {
    Crystals: 'Crystals',
    Minerals: 'Minerals',
    Gemstones: 'Gemstones',
    Igneous: 'Igneous Rocks',
    Sedimentary: 'Sedimentary Rocks',
    Metamorphic: 'Metamorphic Rocks',
  };
  return map[cat] || 'Minerals';
};

export const mineralApiService = {
  /**
   * Fetch all minerals (paginated)
   */
  async getAllMinerals(page = 1, limit = 50): Promise<Mineral[]> {
    const { data } = await api.get(`/minerals?page=${page}&limit=${limit}`);
    return data.data.map(normalizeMineral);
  },

  /**
   * Fetch minerals by category
   */
  async getMineralsByCategory(category: string): Promise<Mineral[]> {
    const backendCategory = reverseMapCategory(category);
    const { data } = await api.get(`/minerals/category/${backendCategory}`);
    return data.data.map(normalizeMineral);
  },

  /**
   * Fetch trending minerals
   */
  async getTrendingMinerals(): Promise<Mineral[]> {
    const { data } = await api.get('/minerals/trending');
    return data.data.map(normalizeMineral);
  },

  /**
   * Search minerals
   */
  async searchMinerals(query: string): Promise<Mineral[]> {
    const { data } = await api.get(`/minerals/search?q=${encodeURIComponent(query)}`);
    return data.data.map(normalizeMineral);
  },

  /**
   * Fetch a single mineral by ID
   */
  async getMineralById(id: string): Promise<Mineral> {
    const { data } = await api.get(`/minerals/${id}`);
    return normalizeMineral(data.data);
  },
};

// Reverse map frontend category to backend category name
const reverseMapCategory = (frontendCat: string): string => {
  const map: Record<string, string> = {
    Crystals: 'Crystals',
    Minerals: 'Minerals',
    Gemstones: 'Gemstones',
    'Igneous Rocks': 'Igneous',
    'Sedimentary Rocks': 'Sedimentary',
    'Metamorphic Rocks': 'Metamorphic',
  };
  return map[frontendCat] || frontendCat;
};
