export type MineralCategory = 
  | 'Crystals'
  | 'Minerals'
  | 'Gemstones'
  | 'Igneous Rocks'
  | 'Sedimentary Rocks'
  | 'Metamorphic Rocks';

export interface Mineral {
  id: string;
  name: string;
  category: MineralCategory | string;
  subCategory: string;
  hardness: string | number;
  rarity: string;
  description: string;
  origin: string;
  uses: string[] | string;
  featured: boolean;
  trending: boolean;
  hasRealImage: boolean;
  imageKey: string;
}
