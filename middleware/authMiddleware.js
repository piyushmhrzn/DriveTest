module.exports = (req, res, next) => {
    if (!req.session.user || req.session.user.userType !== 'driver') {
        return res.redirect('/login');
    }
    next();
};