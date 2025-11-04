// routes/review.js
const express = require('express');
const router = express.Router({ mergeParams: true });
const Review = require('../models/review');
const listing = require('../models/listing');
const wrapAsync = require('../utils/wrapAsync');
const expressErrors = require('../utils/expressError');
const { listingSchema, reviewSchema } = require('../schema');
const { isLoggedIn } = require('../middleware');

// ----------------------------
// Authorization middleware
// ----------------------------
const isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review) {
        req.flash('error', 'Review not found');
        return res.redirect(`/listings/${id}`);
    }
    if (!review.author.equals(req.user._id)) {
        req.flash('error', 'You don\'t have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

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
router.post('/', isLoggedIn, validateReview, wrapAsync(async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    const newReview = new Review(req.body.review);
    // Set the review author
    newReview.author = req.user._id;
    foundListing.reviews.push(newReview);
    await newReview.save();
    await foundListing.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/listings/${foundListing._id}`);
}));

// ----------------------------
// DELETE – Remove a review
// ----------------------------
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, wrapAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;
