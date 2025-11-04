const express = require('express');
const router = express.Router({ mergeParams: true });
const passport = require('passport');
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const { saveRedirectUrl } = require('../middleware');
// const csurf = require('csurf');   // Optional security feature
// router.use(csurf());

/** -------------------------------
 * Helper: Get Safe Redirect URL
 * --------------------------------
 */
function getRedirectUrl(req, defaultUrl = '/listings') {
    const authPaths = ['/login', '/signup'];
    let redirectUrl = defaultUrl;

    if (req.session?.returnTo && !authPaths.includes(req.session.returnTo)) {
        redirectUrl = req.session.returnTo;
    }

    delete req.session?.returnTo;
    return redirectUrl;
}

/** -------------------------------
 * GET /signup → Render signup form
 * --------------------------------
 */
router.get('/signup', (req, res) => {
    // res.render('users/signup', { csrfToken: req.csrfToken?.() }); // if csurf enabled
    res.render('users/signup');
});

/** -------------------------------
 * POST /signup → Handle user signup
 * --------------------------------
 */
router.post('/signup', wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });

        const registeredUser = await User.register(newUser, password);

        // Auto-login after successful registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);

            req.flash('success', `Welcome to Wanderlust, ${registeredUser.username}!`);

            if (process.env.NODE_ENV === 'development') {
                console.log('[Auth] Signup successful for:', registeredUser.username);
                console.log('[Auth] Session before redirect ->', req.session);
            }

            res.redirect(getRedirectUrl(req));
        });
    } catch (e) {
        // Handle duplicate or validation errors gracefully
        let message = e.message;
        if (e.name === 'UserExistsError') {
            message = 'Username already exists. Please try another one.';
        }
        req.flash('error', message);
        res.redirect('/signup');
    }
}));

/** -------------------------------
 * GET /login → Render login form
 * --------------------------------
 */
router.get('/login', (req, res) => {
    // res.render('users/login', { csrfToken: req.csrfToken?.() }); // if csurf enabled
    res.render('users/login');
});

/** -------------------------------
 * POST /login → Authenticate user
 * --------------------------------
 */
router.post('/login', saveRedirectUrl, passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), wrapAsync(async (req, res) => {
    console.log('🔐 [Login] Authentication successful');
    console.log('📦 [Login] Session state:', {
        returnTo: req.session.returnTo,
        sessionID: req.sessionID
    });
    console.log('🌍 [Login] Locals state:', {
        redirectUrl: res.locals.redirectUrl
    });

    // Try both session and locals for the redirect URL
    let redirectUrl = req.session.returnTo || res.locals.redirectUrl || '/listings';
    
    // Clear the stored URLs
    delete req.session.returnTo;
    delete res.locals.redirectUrl;

    console.log('➡️ [Login] Redirecting to:', redirectUrl);

    req.flash('success', `Welcome back, ${req.user.username}!`);
    res.redirect(redirectUrl);
}));


/** -------------------------------
 * POST /logout → Log out user
 * --------------------------------
 */
router.post('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out!');
        res.redirect('/listings');
    });
});

module.exports = router;
