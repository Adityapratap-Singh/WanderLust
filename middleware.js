// middleware.js
module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        // Only save redirect for GET requests
        if (req.method === 'GET') {
            // Save the full URL including query parameters
            req.session.returnTo = req.originalUrl;
            console.log('💾 [isLoggedIn] Saving returnTo URL:', req.originalUrl);
            console.log('📦 [isLoggedIn] Session state:', {
                sessionID: req.sessionID,
                returnTo: req.session.returnTo
            });
        }

        req.flash('error', 'You must be signed in to continue');
        return res.redirect('/login');
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    console.log('🔍 [saveRedirectUrl] Current request:', {
        path: req.originalUrl,
        method: req.method,
        sessionID: req.sessionID
    });

    console.log('📦 [saveRedirectUrl] Session before:', {
        returnTo: req.session.returnTo
    });

    // Store returnTo in res.locals if it exists in session
    if (req.session.returnTo) {
        res.locals.redirectUrl = req.session.returnTo;
        console.log('💾 [saveRedirectUrl] Saved to locals:', res.locals.redirectUrl);
    }

    next();
};
