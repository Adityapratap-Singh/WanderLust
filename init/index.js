const mongoose = require('mongoose');
const initData = require('./data');
const listing = require('../models/listing');

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wonderlust')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Function to initialize the database with sample listings
async function main(){
  await mongoose.connect();
}

const initDB = async () => {
  await listing.insertMany(initData.data);
  console.log("Database initialized with sample listings.");
}

initDB();