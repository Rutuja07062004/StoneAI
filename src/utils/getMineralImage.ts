import { crystalImages } from '../constants/crystalImages';
import { mineralImages } from '../constants/mineralImages';
import { gemstoneImages } from '../constants/gemstoneImages';
import { igneousImages } from '../constants/igneousImages';
import { sedimentaryImages } from '../constants/sedimentaryImages';
import { metamorphicImages } from '../constants/metamorphicImages';

export const getMineralImage = (category: string, imageKey: string, hasRealImage: boolean, name?: string) => {
  const normalizedCategory = category || 'Minerals';
  
  // If we have a verified unique image asset
  if (hasRealImage && imageKey && imageKey !== 'placeholder') {
    const normalizedKey = imageKey.toLowerCase().replace(/\s/g, '').replace(/-/g, '');
    let asset = null;
    switch (normalizedCategory) {
      case 'Crystals': asset = crystalImages[normalizedKey]; break;
      case 'Minerals': asset = mineralImages[normalizedKey]; break;
      case 'Gemstones': asset = gemstoneImages[normalizedKey]; break;
      case 'Igneous Rocks': case 'Igneous': asset = igneousImages[normalizedKey]; break;
      case 'Sedimentary Rocks': case 'Sedimentary': asset = sedimentaryImages[normalizedKey]; break;
      case 'Metamorphic Rocks': case 'Metamorphic': asset = metamorphicImages[normalizedKey]; break;
    }
    if (asset) return asset;
  }

  // Fallback: Use name hash to pick a real image from the corresponding category folder
  const getCategoryImagesList = (cat: string): any[] => {
    switch (cat) {
      case 'Crystals': return Object.values(crystalImages);
      case 'Minerals': return Object.values(mineralImages);
      case 'Gemstones': return Object.values(gemstoneImages);
      case 'Igneous Rocks': case 'Igneous': return Object.values(igneousImages);
      case 'Sedimentary Rocks': case 'Sedimentary': return Object.values(sedimentaryImages);
      case 'Metamorphic Rocks': case 'Metamorphic': return Object.values(metamorphicImages);
      default: return Object.values(mineralImages);
    }
  };

  const getSimpleHash = (str: string): number => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash);
  };

  const list = getCategoryImagesList(normalizedCategory);
  if (list && list.length > 0) {
    const hash = getSimpleHash(name || imageKey || 'default');
    return list[hash % list.length];
  }

  return null;
};
