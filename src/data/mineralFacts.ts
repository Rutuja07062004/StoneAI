export const MINERAL_FACTS = [
  "Diamonds aren't actually the hardest material on Earth. Lonsdaleite, a rare mineral found in meteorite impact sites, is 58% harder.",
  "Quartz is the most abundant and widely distributed mineral found at Earth's surface.",
  "Bismuth forms incredibly perfect, colorful hopper crystals that look like futuristic cityscapes.",
  "Some minerals like Fluorite exhibit fluorescence, meaning they glow under ultraviolet light.",
  "Tourmaline crystals can actually generate a small electrical charge when heated or rubbed.",
];

export const getRandomFact = () => {
  return MINERAL_FACTS[Math.floor(Math.random() * MINERAL_FACTS.length)];
};
