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
  imageKey: string;
  type: string;
  hardness: string;
  composition: string;
  origin: string;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Very Rare' | 'Abundant';
  description: string;
  uses: string;
  marketValue: string;
  image: any;
  category: MineralCategory;
  colors: string[];
  funFacts: string;
  history: string;
  isTrending?: boolean;
}
