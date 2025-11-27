
const mongoose = require('mongoose');
const Listing = require('../models/listing.js');

const dbUrl = process.env.MONGO_URI || 'mongodb+srv://mr_adex:aditya@cluster0.nuenf5q.mongodb.net/?appName=Cluster0';

mongoose.connect(dbUrl);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('✅ MongoDB connected:', dbUrl);
    updateListings();
});

const updateListings = async () => {
    const allListings = await Listing.find({});
    for (let listing of allListings) {
        if (typeof listing.image === 'string') {
            listing.image = { url: listing.image, filename: '' };
            await listing.save();
            console.log(`Updated listing: ${listing.title}`);
        }
    }
    console.log('All listings updated!');
    mongoose.connection.close();
};
