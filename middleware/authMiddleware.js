module.exports = (role) => {
    return (req, res, next) => {
        if (!req.session.user || req.session.user.userType !== role) {
            return res.redirect('/login');
        }
        next();
    };
};