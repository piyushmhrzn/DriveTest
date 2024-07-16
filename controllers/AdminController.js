const User = require('../models/User');

// RENDER APPOINTMENT PAGE
exports.appointment = async (req, res) => {
    try {
        // Check if user session exists
        if (req.session.user) {
            const user = await User.findById(req.session.user.userId);
            return res.render('appointment', { user });
        }

        res.render('appointment', { user: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};
