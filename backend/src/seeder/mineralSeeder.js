const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('../config/db');
const Mineral = require('../models/Mineral');
const mineralData = require('./mineralData');

const seedMinerals = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Mineral.deleteMany();
    console.log('🗑️  Existing minerals cleared');

    // Insert seed data
    const inserted = await Mineral.insertMany(mineralData);
    console.log(`✅ ${inserted.length} minerals seeded successfully`);

    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeder Error: ${error.message}`);
    process.exit(1);
  }
};

seedMinerals();
