const Listing = require('../models/listing');

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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = req.file.path;
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
    res.render('listings/edit', { foundListing });
};

// Update - Update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    const updatedListing = await Listing.findByIdAndUpdate(
        id,
        req.body.listing,
        { new: true, runValidators: true }
    );
    if (req.file) {
        updatedListing.image = req.file.path;
        await updatedListing.save();
    }
    req.flash('success', 'Listing updated successfully!');
    res.redirect(`/listings/${updatedListing._id}`);
};

// Delete - Delete a listing
module.exports.deleteListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Listing deleted successfully!');
    res.redirect('/listings');
};