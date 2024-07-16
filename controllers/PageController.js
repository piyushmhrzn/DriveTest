const User = require('../models/User');
const bcrypt = require('bcrypt');

// RENDER HOMEPAGE
exports.homePage = async (req, res) => {
    try {
        // Check if user session exists
        if (req.session.user) {
            const user = await User.findById(req.session.user.userId);
            return res.render('index', { user });
        }

        res.render('index', { user: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// RENDER G PAGE
exports.gPage = async (req, res) => {
    try {
        // Get user details from database by matching id
        const user = await User.findById(req.session.user.userId);

        // Redirect to login if user doesn't exist
        if (!user) { return res.redirect('/login'); }

        // Compare user's license with default license string 'LICENSE123'
        const licenseMatch = await bcrypt.compare('LICENSE123', user.license);

        // Render g page with user data and licenseMatch boolean value 
        res.render('gTest', { user, isDefaultLicense: licenseMatch });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// RENDER G2 PAGE
exports.g2Page = async (req, res) => {
    try {
        // Get user details from database by matching id
        const user = await User.findById(req.session.user.userId);

        // Redirect to login if user doesn't exist
        if (!user) { return res.redirect('/login'); }

        // Compare user's license with default license string 'LICENSE123'
        const licenseMatch = await bcrypt.compare('LICENSE123', user.license);

        // Render g2 page with user data and licenseMatch boolean value 
        res.render('g2Test', { user, isDefaultLicense: licenseMatch });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// RENDER LOGIN/SIGNUP PAGE
exports.login = (req, res) => {
    res.render('login');
};

// LOGOUT USER
exports.logout = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};