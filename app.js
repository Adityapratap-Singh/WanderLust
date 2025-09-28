const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');



// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));   // enables PUT & DELETE via ?_method=

// ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, 'public')));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wonderlust')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// Root route
app.get('/', (req, res) => {
    res.send('Hello World');
});

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
app.post('/listings', async (req, res) => {
    const newListing = new listing(req.body);
    await newListing.save();
    console.log("New listing created:", newListing);
    res.redirect('/listings');
});

// Edit route – form for editing a listing
app.get('/listings/:id/edit', async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render('listings/edit.ejs', { foundListing });
});

// Update route – handle PUT request
app.put('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const updatedListing = await listing.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    res.redirect(`/listings/${updatedListing._id}`);
});

// Delete route – handle DELETE request
app.delete('/listings/:id', async (req, res) => {
    const { id } = req.params;
    console.log("Deleting listing with ID:", id);
    await listing.findByIdAndDelete(id);
    res.redirect('/listings');
});


// Show route – show a single listing
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render('listings/show.ejs', { foundListing });
});

// Server start
app.listen(8080, () => {
    console.log('Server is running on port http://localhost:8080/listings');
});
