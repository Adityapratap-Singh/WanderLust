const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const listing = require('./models/listing');

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/wonderlust')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get("/testListing", async (req, res) => {
    let sampleListing = new listing({
        title: "Sample Listing",
        description: "This is a sample listing for testing purposes.",
        price: 1200,
        location: "Goa",
        country: "India",
    });

    await sampleListing.save().then(() => {
        res.send("Sample listing created and saved to database.");
    }).catch(err => {
        res.status(500).send("Error saving listing: " + err);
    }); 
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});