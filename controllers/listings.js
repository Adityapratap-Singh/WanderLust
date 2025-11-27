const Listing = require('../models/listing');
const { cloudinary } = require('../cloudinary');

// Index - Show all listings with pagination
module.exports.index = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const allListings = await Listing.find({})
        .populate('reviews')
        .skip(skip)
        .limit(limit + 1); // Fetch one extra to check if there are more

    allListings.forEach(listing => {
        if (listing.reviews.length > 0) {
            listing.averageRating = listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length;
        } else {
            listing.averageRating = 0;
        }
    });

    const totalListings = await Listing.countDocuments();
    const hasMore = skip + limit < totalListings;

    res.render('listings/index', { allListings, page, hasMore });
};

// New - Show form to create new listing
module.exports.renderNewForm = (req, res) => {
    res.render('listings/new');
};

// Create - Create a new listing
module.exports.createListing = async (req, res) => {
    const newListing = new Listing(req.body.listing);

    if (req.file) {
        console.log('Uploaded file:', req.file);
        newListing.image = {
            url: req.file.secure_url,
            filename: req.file.public_id
        };
        console.log('Set image:', newListing.image);
    } else {
        console.log('No file uploaded');
    }
    newListing.owner = req.user._id;
    await newListing.save();
    console.log('Saved listing image:', newListing.image);
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
    const updateData = { ...req.body.listing };

    if (req.file) {
        updateData.image = {
            url: req.file.secure_url,
            filename: req.file.public_id
        };
    }

    const listing = await Listing.findByIdAndUpdate(id, updateData, { new: true });
    console.log(listing);
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${listing._id}`);
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

// Filter by category
module.exports.filterByCategory = async (req, res) => {
    const { category } = req.params;
    const allListings = await Listing.find({ category }).populate('reviews');
    allListings.forEach(listing => {
        if (listing.reviews.length > 0) {
            listing.averageRating = listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length;
        } else {
            listing.averageRating = 0;
        }
    });
    res.render('listings/index', { allListings, page: 1, hasMore: false });
};

// Search
module.exports.search = async (req, res) => {
    const { q } = req.query;
    const allListings = await Listing.find({
        $or: [
            { title: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
            { country: { $regex: q, $options: 'i' } },
            { category: { $regex: q, $options: 'i' } }
        ]
    }).populate('reviews');
    allListings.forEach(listing => {
        if (listing.reviews.length > 0) {
            listing.averageRating = listing.reviews.reduce((acc, review) => acc + review.rating, 0) / listing.reviews.length;
        } else {
            listing.averageRating = 0;
        }
    });
    res.render('listings/index', { allListings, page: 1, hasMore: false });
};

// Destinations
module.exports.destinations = async (req, res) => {
    const allListings = await Listing.find({});
    res.render('listings/destinations', { allListings });
};
