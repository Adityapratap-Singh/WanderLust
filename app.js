require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync')
const expressErrors = require('./utils/expressError');
const { error } = require('console');
const {listingSchema, reviewSchema} = require('./schema')
const Review = require('./models/review');




// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));   // enables PUT & DELETE via ?_method=

// ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// Connect to MongoDB (read from MONGO_URI or fallback to local)
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/wonderlust';
mongoose.connect(dbUrl)
    .then(() => console.log('MongoDB connected:', dbUrl))
    .catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
    res.redirect('/listings');
});

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body.listing);
    console.log(res);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressErrors(400, errMsg);
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body.review);
    console.log(res);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(',');
        throw new expressErrors(400, errMsg);
    } else {
        next();
    }
}

// Index route – show all listings
app.get('/listings', async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
});

// New route – form for creating new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Create route – handle new listing submission
app.post('/listings',validateListing , wrapAsync( async (req, res, next) => {
    const newListing = new listing(req.body);
    await newListing.save();
    res.redirect('/listings');
}));

// Edit route – form for editing a listing
app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render('listings/edit.ejs', { foundListing });
});

// Update route – handle PUT request
app.put('/listings/:id',
    validateListing,
    wrapAsync(async (req, res) => {
    const { id } = req.params;
    const updatedListing = await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect(`/listings/${updatedListing._id}`);
}));

// Delete route – handle DELETE request
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Deleting listing with ID:", id);
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
});

// Review Deleting
app.delete('/listings/:id/reviews/:reviewId', wrapAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));


// Show route – show a single listing
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id).populate("reviews"); 
    res.render('listings/show.ejs', { foundListing });
});

// Review routes
app.post('/listings/:id/reviews',validateReview , wrapAsync(async (req, res) => {
    let { id } = req.params;
    let foundListing = await listing.findById(id);
    let newReview = new Review(req.body.review);
    foundListing.reviews.push(newReview);
    console.log(newReview);
    await newReview.save();
    console.log(foundListing);
    await foundListing.save();
    res.redirect(`/listings/${foundListing._id}`);
}));

// Catch-all for unknown routes
app.use((req, res, next) => {
    next(new expressErrors(404, 'Page Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
    let { statusCode, message } = err;
    res.render('error.ejs', {err})
});

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/listings`);
});
