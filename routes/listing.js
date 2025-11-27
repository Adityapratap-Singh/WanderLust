const express = require('express');
const router = express.Router();
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listings');
const wrapAsync = require('../utils/wrapAsync');
const multer = require('multer');
const { storage } = require('../cloudinary');
const upload = multer({ storage });

// Index and Create
router.route('/')
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingController.createListing));

// New
router.get('/new', isLoggedIn, listingController.renderNewForm);

// Destinations
router.get('/destinations', wrapAsync(listingController.destinations));

// Category
router.get('/category/:category', wrapAsync(listingController.filterByCategory));

// Search
router.get('/search', wrapAsync(listingController.search));

// Edit
router.get('/:id/edit', isLoggedIn, isOwner, wrapAsync(listingController.renderEditForm));

// Show, Update, and Delete
router.route('/:id')
    .get(wrapAsync(listingController.showListing))
    .put(isLoggedIn, isOwner, upload.single('listing[image]'), validateListing, wrapAsync(listingController.updateListing))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;
