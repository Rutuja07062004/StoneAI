const Mineral = require('../models/Mineral');

// @desc    Get all minerals with pagination
// @route   GET /api/minerals
// @access  Public
const getAllMinerals = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Mineral.countDocuments();
    const minerals = await Mineral.find()
      .select('-gallery -__v')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: minerals.length,
      data: minerals,
    });
  } catch (error) {
    console.error(`Error in getAllMinerals: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get mineral by ID
// @route   GET /api/minerals/:id
// @access  Public
const getMineralById = async (req, res) => {
  try {
    const mineral = await Mineral.findById(req.params.id);
    if (!mineral) {
      return res.status(404).json({ success: false, message: 'Mineral not found' });
    }
    res.status(200).json({ success: true, data: mineral });
  } catch (error) {
    console.error(`Error in getMineralById: ${error.message}`);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Mineral not found' });
    }
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get minerals by category
// @route   GET /api/minerals/category/:category
// @access  Public
const getMineralsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const total = await Mineral.countDocuments({ category });
    const minerals = await Mineral.find({ category })
      .select('-gallery -__v')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      category,
      total,
      page,
      pages: Math.ceil(total / limit),
      count: minerals.length,
      data: minerals,
    });
  } catch (error) {
    console.error(`Error in getMineralsByCategory: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get trending minerals
// @route   GET /api/minerals/trending
// @access  Public
const getTrendingMinerals = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;

    const minerals = await Mineral.find({ trending: true })
      .select('-gallery -__v')
      .sort({ featured: -1, name: 1 })
      .limit(limit);

    res.status(200).json({
      success: true,
      count: minerals.length,
      data: minerals,
    });
  } catch (error) {
    console.error(`Error in getTrendingMinerals: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Search minerals by name, category, description
// @route   GET /api/minerals/search?q=quartz
// @access  Public
const searchMinerals = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(400).json({ success: false, message: 'Please provide a search query via ?q=' });
    }

    const regex = new RegExp(q.trim(), 'i');

    const minerals = await Mineral.find({
      $or: [
        { name: regex },
        { category: regex },
        { description: regex },
        { subCategory: regex },
        { origin: regex },
      ],
    })
      .select('-gallery -__v')
      .limit(30);

    res.status(200).json({
      success: true,
      query: q,
      count: minerals.length,
      data: minerals,
    });
  } catch (error) {
    console.error(`Error in searchMinerals: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getAllMinerals,
  getMineralById,
  getMineralsByCategory,
  getTrendingMinerals,
  searchMinerals,
};
