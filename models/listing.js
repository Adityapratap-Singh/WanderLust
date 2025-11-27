const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const listingSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    image:{
        url: String,
        filename: String
    },
    price:{
        type: Number,
        required: true
    },
    location:{
        type: String,
    },
    country:{
        type: String
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    owner:{
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
        },
        coordinates: {
            type: [Number],
        }
    },
    category: {
        type: String,
        enum: [
            'Apartment',
            'House',
            'Condo',
            'Cabin',
            'Villa',
            'Cottage',

            // New categories
            'Trending',
            'Stay',
            'Camp',
            'Adventure',
            'Waterfront',
            'Nature',
            'City',
            'Beach',
            'Trekking',
            'Bike Tours',
            'Road Trip',
            'Food',
            'Photography',
            'Music',
            'Nightlife',
            'Snow',
            'Sunny',
            'Hotels',
            'Glamping',
            'Home Stay',
            'Pet Friendly',
            'Travel',
            'Top Rated'
        ],
        required: true
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;