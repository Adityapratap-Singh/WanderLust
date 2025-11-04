require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const ejs = require('ejs');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const expressErrors = require('./utils/expressError');
const passport = require('passport');
const lS = require('passport-local');
const User = require('./models/user');


const listingsR = require('./routes/listing');
const reviewsR = require('./routes/review');
const usersR = require('./routes/user');
const session = require('express-session');
const flash = require('connect-flash');




// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));   // enables PUT & DELETE via ?_method=

// ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);



// app.get('/fakeUser', async (req, res) => {
//     try {
//         const fakeUser = new User({ email: 'aps@gmail.com', username: 'aps' });
//         const registeredUser = await User.register(fakeUser, 'chicken');
//         res.send(registeredUser);
//     } catch (err) {
//         res.send(err);
//     }
// });

// Session configuration
const sessionOption = {
    secret: "My Super secret code",
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 1 week
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(session(sessionOption));
app.use(flash());

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new lS(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

// expose the current request path and authenticated user to all templates
// This must run after session & passport middleware so `req.user` is populated
app.use((req, res, next) => {
        res.locals.currentPath = req.path;
        res.locals.user = req.user;
        res.locals.currentUser = req.user;
        next();
});

// Redirect root URL to the listings index (All Listings)
app.get('/', (req, res) => {
    res.redirect('/listings');
});

// Connect to MongoDB (read from MONGO_URI or fallback to local)
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/wonderlust';
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('✅ MongoDB connected:', dbUrl);
});



// All Listing and Operation
app.use('/listings', listingsR);
app.use('/listings/:id/reviews', reviewsR);
app.use('/', usersR);

// Catch-all for unknown routes
app.use((req, res, next) => {
    next(new expressErrors(404, 'Page Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});


// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/listings`);
});
