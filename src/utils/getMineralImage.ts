import { crystalImages } from '../constants/crystalImages';
import { mineralImages } from '../constants/mineralImages';
import { gemstoneImages } from '../constants/gemstoneImages';
import { igneousImages } from '../constants/igneousImages';
import { sedimentaryImages } from '../constants/sedimentaryImages';
import { metamorphicImages } from '../constants/metamorphicImages';
import { MineralCategory } from '../types/mineral';

export const getMineralImage = (category: MineralCategory | string, imageKey: string) => {
  if (!category || !imageKey) {
    return null; // Return null to trigger the "No Image" fallback
  }

  console.log('--- Debug Mineral Image ---');
  console.log('Name/Key:', imageKey);
  console.log('Category:', category);

  const normalizedKey = imageKey.toLowerCase().replace(/\s/g, '').replace(/-/g, '');
  console.log('Normalized Key:', normalizedKey);

  let asset: any = null;

  switch (category) {
    case 'Crystals':
      asset = crystalImages[normalizedKey];
      break;
    case 'Minerals':
      asset = mineralImages[normalizedKey];
      break;
    case 'Gemstones':
      asset = gemstoneImages[normalizedKey];
      break;
    case 'Igneous Rocks':
    case 'Igneous':
      asset = igneousImages[normalizedKey];
      break;
    case 'Sedimentary Rocks':
    case 'Sedimentary':
      asset = sedimentaryImages[normalizedKey];
      break;
    case 'Metamorphic Rocks':
    case 'Metamorphic':
      asset = metamorphicImages[normalizedKey];
      break;
  }

  // Cross-category fallback: If backend categorization doesn't perfectly match our asset folders
  if (!asset) {
    asset = crystalImages[normalizedKey] 
         || mineralImages[normalizedKey] 
         || gemstoneImages[normalizedKey] 
         || igneousImages[normalizedKey] 
         || sedimentaryImages[normalizedKey] 
         || metamorphicImages[normalizedKey] 
         || null;
  }

  return asset;
};
