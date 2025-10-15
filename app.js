require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressErrors = require('./utils/expressError');
const listings = require('./routes/listing');
const reviews = require('./routes/review');




// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));   // enables PUT & DELETE via ?_method=

// ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// expose the current request path to all templates so includes (like navbar) can mark active links
app.use((req, res, next) => {
    res.locals.currentPath = req.path;
    next();
});

// Redirect root URL to the listings index (All Listings)
app.get('/', (req, res) => {
    res.redirect('/listings');
});

// Connect to MongoDB (read from MONGO_URI or fallback to local)
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/wonderlust';
mongoose.connect(dbUrl)
    .then(() => console.log('MongoDB connected:', dbUrl))
    .catch(err => console.error('MongoDB connection error:', err));



// All Listing and Operation
app.use('/listings', listings);
app.use('/listings/:id/reviews', reviews);

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
