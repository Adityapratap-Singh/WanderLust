// routes/review.js
const express = require('express');
const router = express.Router({ mergeParams: true }); // ✅ allows access to :id from parent route
const Review = require('../models/review');
const listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const expressErrors = require('../utils/expressError');
const { listingSchema, reviewSchema } = require('../schema');

// ----------------------------
// Validation middleware
// ----------------------------
const validateReview = (req, res, next) => {
    // req.body shape is { review: { rating, comment } }
    // reviewSchema expects an object with a `review` key, so validate the whole body
    let { error } = reviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressErrors(400, errMsg);
    } else {
        next();
    }
}

// ----------------------------
// POST – Add new review
// ----------------------------
router.post('/', validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    const newReview = new Review(req.body.review);
    foundListing.reviews.push(newReview);
    await newReview.save();
    await foundListing.save();
    res.redirect(`/listings/${foundListing._id}`);
}));

// ----------------------------
// DELETE – Remove a review
// ----------------------------
router.delete('/:reviewId', wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    console.log(req.params);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
