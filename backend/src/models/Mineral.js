const mongoose = require('mongoose');

const mineralSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Mineral name is required'],
      trim: true,
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Crystals', 'Minerals', 'Gemstones', 'Igneous', 'Sedimentary', 'Metamorphic'],
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    hardness: {
      type: Number,
      min: 1,
      max: 10,
    },
    rarity: {
      type: String,
      enum: ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    origin: {
      type: String,
    },
    uses: {
      type: [String],
      default: [],
    },
    image: {
      type: String,
      default: '',
    },
    gallery: {
      type: [String],
      default: [],
    },
    trending: {
      type: Boolean,
      default: false,
      index: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    chemicalFormula: {
      type: String,
    },
    crystalSystem: {
      type: String,
    },
    luster: {
      type: String,
    },
    color: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
mineralSchema.index({ name: 'text', description: 'text', category: 'text' });

const Mineral = mongoose.model('Mineral', mineralSchema);
module.exports = Mineral;
