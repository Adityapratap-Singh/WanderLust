const express = require('express');
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/users');
const { saveRedirectUrl, validateUser } = require('../middleware');
const wrapAsync = require('../utils/wrapAsync');

// Signup routes
router.route('/signup')
    .get(userController.renderSignup)
    .post(validateUser, wrapAsync(userController.signup));

// Login routes
router.route('/login')
    .get(userController.renderLogin)
    .post(saveRedirectUrl, 
          passport.authenticate('local', {
              failureFlash: true,
              failureRedirect: '/login'
          }), 
          userController.login);

// Logout route
router.get('/logout', userController.logout);

module.exports = router;
