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
        type: String,
        default: 'https://i.pinimg.com/1200x/c9/60/e5/c960e575cf8225227dcf5b826561bc46',
        set: v => v === '' ? 'https://www.pinterest.com/ideas/unavailable-profile-pic/949980617996/' : v
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
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;