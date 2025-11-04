require('dotenv').config();
const mongoose = require('mongoose');
const initData = require('./data');
const Listing = require('../models/listing');

const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/wonderlust';

mongoose.connect(dbUrl)
  .then(() => console.log('✅ MongoDB connected for seeding:', dbUrl))
  .catch(err => {
    console.error('❌ MongoDB connection error (seeding):', err);
    process.exit(1);
  });

const initDB = async () => {
  try {
    const OWNER_ID = "6905fa24b41d7941d874c4bd"; // your new owner ID

    for (const item of initData.data) {
      const existing = await Listing.findOne({ title: item.title });

      if (existing) {
        // ✅ Add owner only if it's missing
        if (!existing.owner) {
          existing.owner = OWNER_ID;
          await existing.save();
          console.log(`🛠️ Added owner to existing listing: ${item.title}`);
        } else {
          console.log(`⚠️ Owner already exists for: ${item.title}`);
        }
        continue;
      }

      // ✅ Create new listing with owner
      const newListing = new Listing({
        ...item,
        owner: OWNER_ID,
      });

      await newListing.save();
      console.log(`✅ Inserted new listing: ${item.title}`);
    }

    console.log('🎉 Database seeding complete.');
  } catch (err) {
    console.error('🚨 Seeding error:', err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

initDB();
