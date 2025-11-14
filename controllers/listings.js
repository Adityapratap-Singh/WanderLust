const Listing = require('../models/listing');
const { cloudinary } = require('../cloudinary');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

// Index - Show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
};

// New - Show form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
};

// Create - Create a new listing
module.exports.createListing = async (req, res) => {
    const geoData = await geocodingClient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    }).send();
    
    const newListing = new Listing(req.body.listing);
    newListing.geometry = geoData.body.features[0].geometry;
    
    if (req.file) {
        newListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${newListing._id}`);
};

// Show - Show one listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id)
        .populate({
            path: 'reviews',
            populate: {
                path: 'author'
            }
        })
        .populate('owner');
    if (!foundListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }

    let averageRating = 0;
    if (foundListing.reviews.length > 0) {
        averageRating = foundListing.reviews.reduce((acc, review) => acc + review.rating, 0) / foundListing.reviews.length;
    }

    res.render('listings/show', { foundListing, averageRating });
};

// Edit - Show form to edit listing
module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    if (!foundListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    let originalUrl = '';
    if (foundListing.image) {
        originalUrl = foundListing.image.url.replace(/\\/g, '/');
    }
    res.render('listings/edit', { foundListing, originalUrl });
};

// Update - Update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );

    if(req.body.listing.location){
        const geoData = await geocodingClient.forwardGeocode({
            query: req.body.listing.location,
            limit: 1
        }).send();
        updatedListing.geometry = geoData.body.features[0].geometry;
    }

    if (req.file) {
        if (updatedListing.image && updatedListing.image.filename) {
            await cloudinary.uploader.destroy(updatedListing.image.filename);
        }
        updatedListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await updatedListing.save();
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
};

// Delete - Delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (listing.image && listing.image.filename) {
        await cloudinary.uploader.destroy(listing.image.filename);
    }
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
};