export interface MineralData {
  id: string;
  name: string;
  formula: string;
  hardness: string;
  origin: string;
  structure: string;
  value: string;
  trend: string;
  description: string;
  uses: string[];
  image: string;
  properties: {
    color: string;
    lustre: string;
    transparency: string;
    streak: string;
  };
}

export const MINERALS_DB: Record<string, MineralData> = {
  granite: {
    id: 'granite',
    name: 'Natural Granite',
    formula: 'SiO₂ + Al₂O₃ + K₂O',
    hardness: '6.0 - 7.0',
    origin: 'Continental Crust',
    structure: 'Granular',
    value: '$20 - $80',
    trend: '+1.5%',
    description: 'A coarse-grained igneous rock. It is the most common rock found on the surface of the Earth, forming the core of many mountain ranges.',
    uses: ['Construction', 'Countertops', 'Public Monuments'],
    image: 'https://images.pexels.com/photos/161702/granite-stone-texture-pattern-161702.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: {
      color: 'Grey / Pink / White',
      lustre: 'Dull to Pearly',
      transparency: 'Opaque',
      streak: 'White'
    }
  },
  basalt: {
    id: 'basalt',
    name: 'Volcanic Basalt',
    formula: 'MgFeSi₂O₆ + CaAl₂Si₂O₈',
    hardness: '5.0 - 6.0',
    origin: 'Oceanic Crust',
    structure: 'Aphanitic',
    value: '$10 - $40',
    trend: '+0.8%',
    description: 'A dark, fine-grained volcanic rock. It is formed from the rapid cooling of magnesium-rich and iron-rich lava.',
    uses: ['Road Construction', 'Industrial Fiber', 'Landscaping'],
    image: 'https://images.pexels.com/photos/10186525/pexels-photo-10186525.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: {
      color: 'Dark Grey / Black',
      lustre: 'Dull',
      transparency: 'Opaque',
      streak: 'Dark Grey'
    }
  },
  emerald: {
    id: 'emerald',
    name: 'Raw Emerald',
    formula: 'Be₃Al₂Si₆O₁₈',
    hardness: '7.5 - 8.0',
    origin: 'Colombia',
    structure: 'Hexagonal',
    value: '$1,250 - $1,400',
    trend: '+12.5%',
    description: 'A prestigious beryl variety formed in hydrothermal veins. This specimen displays the famous "Muzo Green" saturation.',
    uses: ['High-end Jewelry', 'Precision Optics'],
    image: 'https://images.pexels.com/photos/10186522/pexels-photo-10186522.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: {
      color: 'Deep Vivid Green',
      lustre: 'Vitreous',
      transparency: 'Transparent',
      streak: 'White'
    }
  },
  amethyst: {
    id: 'amethyst',
    name: 'Amethyst Quartz',
    formula: 'SiO₂',
    hardness: '7.0',
    origin: 'Brazil / Uruguay',
    structure: 'Trigonal',
    value: '$45 - $120',
    trend: '+2.1%',
    description: 'A purple variety of quartz that owes its color to irradiation and iron impurities. Highly valued for its deep violet hues.',
    uses: ['Ornamental Decor', 'Jewelry', 'Collections'],
    image: 'https://images.pexels.com/photos/10186523/pexels-photo-10186523.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: {
      color: 'Purple / Violet',
      lustre: 'Vitreous',
      transparency: 'Transparent to Translucent',
      streak: 'White'
    }
  },
  sapphire: {
    id: 'sapphire',
    name: 'Blue Sapphire',
    formula: 'Al₂O₃',
    hardness: '9.0',
    origin: 'Sri Lanka / Kashmir',
    structure: 'Trigonal',
    value: '$2,800 - $4,500',
    trend: '+8.4%',
    description: 'A precious corundum variety. After diamond, it is the hardest natural mineral known to man.',
    uses: ['High-end Jewelry', 'Watch Crystals', 'Scientific Lasers'],
    image: 'https://images.pexels.com/photos/10186524/pexels-photo-10186524.jpeg?auto=compress&cs=tinysrgb&w=800',
    properties: {
      color: 'Cornflower Blue',
      lustre: 'Adamantine',
      transparency: 'Transparent',
      streak: 'White'
    }
  }
};
