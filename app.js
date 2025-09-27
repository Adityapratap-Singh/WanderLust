const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing');
const path = require('path');

app.set('views', path.join(__dirname, 'views'));

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wonderlust')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World');
});


// index route to display all listings
app.get('/listings', async (req, res) => {
    const allListings = await listing.find({});
    res.render('listings/index.ejs', { allListings });
});

// create route to display form for new listing
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

//create route to handle form submission for new listing
app.post('/listings', express.urlencoded({ extended: true }), async (req, res) => {
    const newListing = new listing(req.body);
    await newListing.save();
    res.redirect('/listings');
});

// show route to display a single listing
app.get('/listings/:id', async (req, res) => {
    const { id } = req.params;
    const foundListing = await listing.findById(id);
    res.render('listings/show.ejs', { foundListing });
});

// app.get("/testListing", async (req, res) => {
//     let sampleListing = new listing({
//         title: "Sample Listing",
//         description: "This is a sample listing for testing purposes.",
//         price: 1200,
//         location: "Goa",
//         country: "India",
//     }
// );

//     await sampleListing.save().then(() => {
//         res.send("Sample listing created and saved to database.");
//     }).catch(err => {
//         res.status(500).send("Error saving listing: " + err);
//     }); 
// });

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});