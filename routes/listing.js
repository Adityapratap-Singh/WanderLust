// routes/listing.js
const express = require('express');
const router = express.Router();
const Listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/expressError');
const { listingSchema } = require('../schema');
const { isLoggedIn } = require('../middleware'); // ✅ clean import

// ----------------------------
// Validate Listing Middleware
// ----------------------------
const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

// ----------------------------
// Index Route – Show all listings
// ----------------------------
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/index', { allListings });
}));

// ----------------------------
// New Route – Show form to create new listing
// ----------------------------
router.get('/new', isLoggedIn, (req, res) => {
    res.render('listings/new');
});

// ----------------------------
// Create Route – Add a new listing
// ----------------------------
router.post('/', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();

    req.flash('success', 'Successfully created a new listing!');
    res.redirect(`/listings/${newListing._id}`);
}));

// ----------------------------
// Edit Route – Show form to edit listing
// ----------------------------
router.get('/:id/edit', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id);
    if (!foundListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/edit', { foundListing });
}));

// ----------------------------
// Update Route – Apply changes to listing
// ----------------------------
router.put('/:id', isLoggedIn, validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );

    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
}));

// ----------------------------
// Delete Route – Remove listing
// ----------------------------
router.delete('/:id', isLoggedIn, wrapAsync(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
}));

// ----------------------------
// Show Route – Display single listing
// ----------------------------
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await Listing.findById(id).populate('reviews');
    if (!foundListing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    res.render('listings/show', { foundListing });
}));

module.exports = router;
