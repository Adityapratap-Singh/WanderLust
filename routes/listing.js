// routes/listing.js
const express = require('express');
const router = express.Router();
const listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const expressErrors = require('../utils/expressError');
const { listingSchema } = require('../schema');

// Middleware for validating listings
const validateListing = (req, res, next) => {
    // req.body should have shape { listing: { ... } }
    // listingSchema expects an object with a `listing` key, so validate the whole body
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new expressErrors(400, errMsg);
    } else {
        next();
    }
};


// ----------------------------
// Index Route – Show all listings
// ----------------------------
router.get('/', wrapAsync(async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
}));

// ----------------------------
// New Route – Show form to create new listing
// ----------------------------
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

// ----------------------------
// Create Route – Add a new listing
// ----------------------------
router.post('/', validateListing, wrapAsync(async (req, res) => {
    const newListing = new listing(req.body.listing); // ✅ note: must access `req.body.listing`
    await newListing.save();
    res.redirect('/listings');
}));

// ----------------------------
// Edit Route – Show form to edit listing
// ----------------------------
router.get('/:id/edit', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    if (!foundListing) throw new expressErrors(404, 'Listing not found');
    res.render('listings/edit.ejs', { foundListing });
}));

// ----------------------------
// Update Route – Apply changes to listing
// ----------------------------
router.put('/:id', validateListing, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );
    res.redirect(`/listings/${updatedListing._id}`); // ✅ added slash
}));

// ----------------------------
// Delete Route – Remove listing
// ----------------------------
router.delete('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
}));

// ----------------------------
// Show Route – Display single listing
// ----------------------------
router.get('/:id', wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id).populate('reviews');
    if (!foundListing) throw new expressErrors(404, 'Listing not found');
    res.render('listings/show.ejs', { foundListing });
}));


module.exports = router;
