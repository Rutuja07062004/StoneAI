const fs = require('fs');
const path = require('path');

// Defined mappings for each category
const mappings = {
  'Crystals': {
    'quartz': 'quartz',
    'amethyst': 'amethyst',
    'rosequartz': 'rosequartz',
    'rose quartz': 'rosequartz',
    'citrine': 'citrine',
    'smokyquartz': 'smokyquartz',
    'smoky quartz': 'smokyquartz',
    'fluorite': 'fluorite',
    'selenite': 'selenite',
    'blacktourmaline': 'blacktourmaline',
    'black tourmaline': 'blacktourmaline'
  },
  'Minerals': {
    'pyrite': 'pyrite',
    'calcite': 'calcite',
    'hematite': 'hematite',
    'malachite': 'malachite',
    'galena': 'galena',
    'sulfur': 'sulfur',
    'mica': 'mica',
    'fluorite': 'fluorite',
    'turquoise': 'turquoise'
  },
  'Gemstones': {
    'ruby': 'ruby',
    'sapphire': 'sapphire',
    'emerald': 'emerald',
    'diamond': 'diamond',
    'opal': 'opal',
    'topaz': 'topaz',
    'garnet': 'garnet',
    'aquamarine': 'aquamarine'
  },
  'Igneous Rocks': {
    'granite': 'granite',
    'basalt': 'basalt',
    'obsidian': 'obsidian',
    'pumice': 'pumice',
    'diorite': 'diorite',
    'gabbro': 'gabbro',
    'rhyolite': 'rhyolite',
    'andesite': 'andesite'
  },
  'Sedimentary Rocks': {
    'sandstone': 'sandstone',
    'limestone': 'limestone',
    'shale': 'shale',
    'conglomerate': 'conglomerate',
    'breccia': 'breccia',
    'chalk': 'chalk',
    'coal': 'coal',
    'siltstone': 'siltstone'
  },
  'Metamorphic Rocks': {
    'marble': 'marble',
    'slate': 'slate',
    'gneiss': 'gneiss',
    'schist': 'schist',
    'quartzite': 'quartzite',
    'phyllite': 'phyllite',
    'hornfels': 'hornfels',
    'amphibolite': 'amphibolite'
  }
};

const updateList = (minerals) => {
  let updatedCount = 0;
  minerals.forEach(m => {
    const category = m.category;
    const catMap = mappings[category];
    if (catMap) {
      const nameKey = m.name.toLowerCase().trim();
      const mappedKey = catMap[nameKey];
      if (mappedKey) {
        m.hasRealImage = true;
        m.imageKey = mappedKey;
        updatedCount++;
      }
    }
  });
  console.log(`Updated ${updatedCount} mineral entries to have real images!`);
  return minerals;
};

// Load backend seeder file (which was already updated or loaded fresh)
const seederPath = path.join(__dirname, '../backend/src/seeder/mineralData.js');
let seederContent = fs.readFileSync(seederPath, 'utf8');

const startIdx = seederContent.indexOf('[');
const endIdx = seederContent.lastIndexOf(']');
const arrayStr = seederContent.substring(startIdx, endIdx + 1);
let mineralsArray = JSON.parse(arrayStr);

// Run mapping to be absolutely sure
mineralsArray = updateList(mineralsArray);

// Write seeder file
const newSeederContent = `const minerals = ${JSON.stringify(mineralsArray, null, 2)};\n\nmodule.exports = minerals;\n`;
fs.writeFileSync(seederPath, newSeederContent, 'utf8');
console.log('Successfully wrote backend seeder file!');

// Write frontend minerals.ts offline file
const offlinePath = path.join(__dirname, '../src/data/minerals.ts');
const newOfflineContent = `import { MineralCategory } from '../types/mineral';\n\nexport const MINERALS: any[] = ${JSON.stringify(mineralsArray, null, 2)};\n`;
fs.writeFileSync(offlinePath, newOfflineContent, 'utf8');
console.log('Successfully wrote frontend offline minerals.ts!');
