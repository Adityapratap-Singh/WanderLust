module.exports.renderContact = (req, res) => {
    res.render('pages/contact');
};

module.exports.handleContact = (req, res) => {
    const { name, email, message } = req.body;
    // Here you would typically handle the form submission, e.g., send an email
    console.log(`Received message from ${name} (${email}): ${message}`);
    req.flash('success', 'Your message has been sent successfully!');
    res.redirect('/listings');
};

module.exports.renderPrivacy = (req, res) => {
    res.render('pages/privacy');
};

module.exports.renderTerms = (req, res) => {
    res.render('pages/terms');
};

module.exports.renderAbout = (req, res) => {
    res.render('pages/about');
};

module.exports.renderHelp = (req, res) => {
    res.render('pages/help');
};

module.exports.renderSitemap = (req, res) => {
    res.render('pages/sitemap');
};

module.exports.renderCareer = (req, res) => {
    res.render('pages/career');
};

module.exports.renderBlog = (req, res) => {
    res.render('pages/blog');
};

module.exports.renderPress = (req, res) => {
    res.render('pages/press');
};

module.exports.renderGiftCards = (req, res) => {
    res.render('pages/gift-cards');
};

module.exports.renderCollections = (req, res) => {
    res.render('pages/collections');
};

module.exports.renderHost = (req, res) => {
    res.render('pages/host');
};

module.exports.renderInspiration = (req, res) => {
    res.render('pages/inspiration');
};

module.exports.renderCommunity = (req, res) => {
    res.render('pages/community');
};

module.exports.renderMagazine = (req, res) => {
    res.render('pages/magazine');
};

module.exports.renderGhoomoNew = (req, res) => {
    res.render('pages/ghoomo-new');
};

module.exports.renderCompanyDetails = (req, res) => {
    res.render('pages/company-details');
};

module.exports.renderExplore = (req, res) => {
    res.render('pages/explore');
};

module.exports.renderHosting = (req, res) => {
    res.render('pages/hosting');
};

module.exports.renderJobs = (req, res) => {
    res.render('pages/jobs');
};

module.exports.renderNewsroom = (req, res) => {
    res.render('pages/newsroom');
};

module.exports.renderPartners = (req, res) => {
    res.render('pages/partners');
};
