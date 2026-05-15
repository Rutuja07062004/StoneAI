/**
 * Centralized mapping of mineral names to image sources.
 * Using verified local assets for Crystals, Minerals, Gemstones, Igneous, Sedimentary, and Metamorphic Rocks.
 */
export const MINERAL_IMAGES: Record<string, any> = {
  // --- CRYSTALS (Local Assets) ---
  quartz: require('../assets/minerals/crystals/quartz.png'),
  amethyst: require('../assets/minerals/crystals/amethyst.png'),
  rosequartz: require('../assets/minerals/crystals/rose-quartz.png'),
  citrine: require('../assets/minerals/crystals/citrine.png'),
  smokyquartz: require('../assets/minerals/crystals/smoky-quartz.png'),
  fluorite: require('../assets/minerals/crystals/fluorite.png'),
  selenite: require('../assets/minerals/crystals/selenite.png'),
  blacktourmaline: require('../assets/minerals/crystals/black-tourmaline.png'),

  // --- MINERALS (Local Assets) ---
  pyrite: require('../assets/minerals/minerals/pyrite.jpg'),
  calcite: require('../assets/minerals/minerals/calcite.jpg'),
  hematite: require('../assets/minerals/minerals/hematite.jpg'),
  malachite: require('../assets/minerals/minerals/malachite.jpg'),
  galena: require('../assets/minerals/minerals/galena.jpg'),
  sulfur: require('../assets/minerals/minerals/sulfur.jpg'),
  mica: require('../assets/minerals/minerals/mica.jpg'),
  fluoritespecimen: require('../assets/minerals/minerals/fluorite.jpg'),

  // --- GEMSTONES (Local Assets) ---
  ruby: require('../assets/minerals/gemstones/ruby.jpg'),
  sapphire: require('../assets/minerals/gemstones/sapphire.jpg'),
  emerald: require('../assets/minerals/gemstones/emerald.jpg'),
  diamond: require('../assets/minerals/gemstones/diamond.jpg'),
  opal: require('../assets/minerals/gemstones/opal.jpg'),
  topaz: require('../assets/minerals/gemstones/topaz.jpg'),
  garnet: require('../assets/minerals/gemstones/garnet.jpg'),
  aquamarine: require('../assets/minerals/gemstones/aquamarine.jpg'),

  // --- IGNEOUS ROCKS (Local Assets) ---
  granite: require('../assets/minerals/igneous/granite.jpg'),
  basalt: require('../assets/minerals/igneous/basalt.jpg'),
  obsidian: require('../assets/minerals/igneous/obsidian.jpg'),
  pumice: require('../assets/minerals/igneous/pumice.jpg'),
  diorite: require('../assets/minerals/igneous/diorite.jpg'),
  gabbro: require('../assets/minerals/igneous/gabbro.jpg'),
  rhyolite: require('../assets/minerals/igneous/rhyolite.jpg'),
  andesite: require('../assets/minerals/igneous/andesite.jpg'),

  // --- SEDIMENTARY ROCKS (Local Assets) ---
  sandstone: require('../assets/minerals/sedimentary/sandstone.jpg'),
  limestone: require('../assets/minerals/sedimentary/limestone.jpg'),
  shale: require('../assets/minerals/sedimentary/shale.jpg'),
  conglomerate: require('../assets/minerals/sedimentary/conglomerate.jpg'),
  breccia: require('../assets/minerals/sedimentary/breccia.jpg'),
  chalk: require('../assets/minerals/sedimentary/chalk.jpg'),
  coal: require('../assets/minerals/sedimentary/coal.jpg'),
  siltstone: require('../assets/minerals/sedimentary/siltstone.jpg'),

  // --- METAMORPHIC ROCKS (Local Assets) ---
  marble: require('../assets/minerals/metamorphic/marble.jpg'),
  slate: require('../assets/minerals/metamorphic/slate.jpg'),
  gneiss: require('../assets/minerals/metamorphic/gneiss.jpg'),
  schist: require('../assets/minerals/metamorphic/schist.jpg'),
  quartzite: require('../assets/minerals/metamorphic/quartzite.jpg'),
  phyllite: require('../assets/minerals/metamorphic/phyllite.jpg'),
  hornfels: require('../assets/minerals/metamorphic/hornfels.jpg'),
  amphibolite: require('../assets/minerals/metamorphic/amphibolite.jpg'),

  // --- OTHERS & FALLBACKS ---
  placeholder: require('../assets/minerals/crystals/quartz.png'),
};

/**
 * Safely get a mineral image source by imageKey.
 */
export const getMineralImage = (imageKey: string) => {
  if (!imageKey) return MINERAL_IMAGES.placeholder;
  const normalizedKey = imageKey.toLowerCase().replace(/\s/g, '').replace(/-/g, '');
  
  return MINERAL_IMAGES[normalizedKey] || MINERAL_IMAGES[imageKey] || MINERAL_IMAGES.placeholder;
};
