const express = require('express');
const router = express.Router({ mergeParams: true });
const User = require('../models/user');
const wrapAsync = require('../utils/wrapAsync');
const passport = require('passport');

// Sign up form
router.get('/signUp', (req, res) => {
    res.render('users/signup');
});

// Handle signup
router.post('/signUp', wrapAsync(async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        const newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);

        // Automatically log the user in after registration
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            req.flash('success', `Welcome to Wanderlust, ${registeredUser.username}!`);
            res.redirect('/listings');
        });
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/signUp');
    }
}));

// Login form
router.get('/login', (req, res) => {
    res.render('users/login');
});

// Handle login
router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login'
}), wrapAsync(async(req, res) => {
    req.flash('success', `Welcome back, ${req.user.username}!`);
    const redirectUrl = req.session.returnTo || '/listings';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}));

// Logout User
router.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Successfully logged out!');
        res.redirect('/listings');
    });
});


module.exports = router;
