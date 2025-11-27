const express = require('express');
const router = express.Router();

const listingRoutes = require('./listing');
const reviewRoutes = require('./review');
const userRoutes = require('./user');
const pageRoutes = require('./pages');

router.use('/listings', listingRoutes);
router.use('/listings/:id/reviews', reviewRoutes);
router.use('/', userRoutes);
router.use('/', pageRoutes);

module.exports = router;
