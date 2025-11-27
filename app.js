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
const helmet = require('helmet');
const sanitize = require('mongo-sanitize');
const { doubleCsrf } = require("csrf-csrf");
const crypto = require('crypto');

const routes = require('./routes');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const Listing = require('./models/listing');

// Connect to MongoDB
const dbUrl = process.env.MONGO_URI;

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(helmet({
    contentSecurityPolicy: false,
}));

// ejs-locals for all ejs templates:
app.engine('ejs', ejsMate);

// Session configuration
const sessionOption = {
    secret: "My Super secret code",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: dbUrl }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};

app.use(cookieParser("My Super secret code"));
app.use(session(sessionOption));
app.use(flash());

const doubleCsrfUtilities = doubleCsrf({
    getSecret: () => "My Super secret code",
    cookieName: "x-csrf-token",
    cookieOptions: {
        sameSite: "lax",
        path: "/",
        secure: false,
    },
    size: 64,
    ignoredMethods: ["GET", "HEAD", "OPTIONS"],
    getTokenFromRequest: (req) => req.body._csrf,
    getSessionIdentifier: (req) => req.session.csrfSecret || (req.session.csrfSecret = crypto.randomBytes(32).toString('hex')),
});

// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new lS(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  res.locals.csrfToken = doubleCsrfUtilities.generateCsrfToken(req, res);
  res.locals.user = req.user;
  res.locals.currentUser = req.user;
  next();
});

app.use('/favicon.ico', (req, res) => res.sendStatus(204));

// Middleware to ignore sourcemap requests
app.use((req, res, next) => {
    if (req.path.endsWith('.map')) {
        return res.sendStatus(204);
    }
    next();
});

// Redirect root URL to the listings index
app.get('/', (req, res) => {
    res.redirect('/listings');
});

// Middleware to set currentPath
app.use((req, res, next) => {
  res.locals.currentPath = req.path;
  next();
});

// Middleware to fetch all unique categories
app.use(async (req, res, next) => {
  try {
    const categories = await Listing.distinct('category');
    res.locals.categories = categories;
    next();
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.locals.categories = [];
    next();
  }
});

// All Listing and Operation
app.use('/', routes);

// Connect to MongoDB
mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('✅ MongoDB connected:', dbUrl);
});

// Catch-all for unknown routes
app.use((req, res, next) => {
    next(new expressErrors(404, 'Page Not Found'));
});

// Error handler
app.use((err, req, res, next) => {
    if (!(err instanceof expressErrors)) {
        err = new expressErrors(500, 'Something went wrong!');
    }
    if (err.statusCode !== 404) {
        console.log(err);
    }
    const { statusCode = 500, message = 'Something went wrong!' } = err;
    res.status(statusCode).render('error', { err: { statusCode, message, stack: err.stack } });
});

// Server start
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/listings`);
});
