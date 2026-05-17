const express = require('express');
const router = express.Router();
const {
  getAllMinerals,
  getMineralById,
  getMineralsByCategory,
  getTrendingMinerals,
  searchMinerals,
} = require('../controllers/mineralController');

// GET /api/minerals/trending  ← must be before /:id to avoid conflict
router.get('/trending', getTrendingMinerals);

// GET /api/minerals/search?q=quartz
router.get('/search', searchMinerals);

// GET /api/minerals/category/:category
router.get('/category/:category', getMineralsByCategory);

// GET /api/minerals
router.get('/', getAllMinerals);

// GET /api/minerals/:id
router.get('/:id', getMineralById);

module.exports = router;
