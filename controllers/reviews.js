const Review = require('../models/review');
const Listing = require('../models/listing');

// Create a new review
module.exports.createReview = async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    const review = new Review(req.body.review);
    // Set the author to the currently logged in user
    review.author = req.user._id;
    listing.reviews.push(review);
    await review.save();
    await listing.save();
    req.flash('success', 'Review added successfully!');
    res.redirect(`/listings/${listing._id}`);
};

// Delete a review
module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted successfully!');
    res.redirect(`/listings/${id}`);
};