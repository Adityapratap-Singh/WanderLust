const Listing = require('./models/listing');
const Review = require('./models/review');
const ExpressError = require('./utils/expressError');
const { listingSchema, reviewSchema, userSchema } = require('./schema');

module.exports.validateUser = (req, res, next) => {
    const { error } = userSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        req.flash('error', errMsg);
        return res.redirect('/signup');
    }
    next();
};

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        if (req.method === 'GET') {
            req.session.returnTo = req.originalUrl;
        }
        req.flash('error', 'You must be signed in to continue');
        return res.redirect('/login');
    }
    next();
};

module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash('error', 'Listing not found');
        return res.redirect('/listings');
    }
    if (!listing.owner.equals(req.user._id)) {
        req.flash('error', 'You don\'t have permission to do that');
        return res.redirect(`/listings/${id}`);
    }
    next();
};

module.exports.isReviewAuthor = async (req, res, next) => {
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

module.exports.validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const errMsg = error.details.map((el) => el.message).join(',');
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo;
    }
    next();
};
