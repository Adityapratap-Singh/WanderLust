const express = require('express');
const router = express.Router();
const pagesController = require('../controllers/pages');

router.get('/contact', pagesController.renderContact);
router.post('/contact', pagesController.handleContact);

router.get('/privacy', pagesController.renderPrivacy);
router.get('/terms', pagesController.renderTerms);
router.get('/about', pagesController.renderAbout);
router.get('/help', pagesController.renderHelp);
router.get('/sitemap', pagesController.renderSitemap);
router.get('/career', pagesController.renderCareer);
router.get('/blog', pagesController.renderBlog);
router.get('/press', pagesController.renderPress);
router.get('/gift-cards', pagesController.renderGiftCards);
router.get('/collections', pagesController.renderCollections);
router.get('/host', pagesController.renderHost);
router.get('/inspiration', pagesController.renderInspiration);
router.get('/community', pagesController.renderCommunity);
router.get('/magazine', pagesController.renderMagazine);
router.get('/ghoomo-new', pagesController.renderGhoomoNew);
router.get('/company-details', pagesController.renderCompanyDetails);
router.get('/explore', pagesController.renderExplore);
router.get('/hosting', pagesController.renderHosting);
router.get('/jobs', pagesController.renderJobs);
router.get('/newsroom', pagesController.renderNewsroom);
router.get('/partners', pagesController.renderPartners);

module.exports = router;
