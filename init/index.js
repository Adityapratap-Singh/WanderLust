require('dotenv').config();
const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

// Connect to MongoDB (read from MONGO_URI or fallback to local)
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/wonderlust';

mongoose.connect(dbUrl)
  .then(() => console.log('MongoDB connected for seeding:', dbUrl))
  .catch(err => {
    console.error('MongoDB connection error (seeding):', err);
    process.exit(1);
  });

// Seed the database idempotently: insert only if a record with same title doesn't exist
const initDB = async () => {
  try {
    for (const item of initData.data) {
      const exists = await Listing.findOne({ title: item.title }).exec();
      if (exists) {
        console.log(`Skipping existing listing: ${item.title}`);
        continue;
      }
      await Listing.create(item);
      console.log(`Inserted listing: ${item.title}`);
    }
    console.log('Database seeding complete.');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

initDB();