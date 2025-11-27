const User = require('../models/user');

// Shows the registration page where new users can create their account
module.exports.renderSignup = (req, res) => {
    res.render('users/signup');
};

// Handles the actual account creation process
// Takes the user's information, creates their account, and logs them in automatically
module.exports.signup = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        
        // Once registered, automatically log them in for a smoother experience
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', 'Welcome to Ghoomo!');
            res.redirect('/listings');
        });
    } catch (e) {
        // If something goes wrong (like username already taken), let the user know
        req.flash('error', e.message);
        res.redirect('/signup');
    }
};

// Displays the login page for returning users
module.exports.renderLogin = (req, res) => {
    res.render('users/login');
};

// Processes the login attempt and welcomes back returning users
// After login, takes them to their requested page or the listings page
module.exports.login = (req, res) => {
    req.flash('success', 'Welcome back!');
    const redirectUrl = res.locals.returnTo || '/listings';
    res.redirect(redirectUrl);
};

// Safely logs out the user and ends their session
// Returns them to the listings page with a goodbye message
module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Logged out successfully!');
        res.redirect('/listings');
    });
};