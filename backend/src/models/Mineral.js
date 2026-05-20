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
      enum: ['Crystals', 'Minerals', 'Gemstones', 'Igneous Rocks', 'Sedimentary Rocks', 'Metamorphic Rocks'],
      index: true,
    },
    subCategory: {
      type: String,
      trim: true,
    },
    hardness: {
      type: String,
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
    hasRealImage: {
      type: Boolean,
      default: false,
    },
    imageKey: {
      type: String,
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
  },
  {
    timestamps: true,
  }
);

// Compound text index for search
mineralSchema.index({ name: 'text', description: 'text', category: 'text' });

const Mineral = mongoose.model('Mineral', mineralSchema);
module.exports = Mineral;
