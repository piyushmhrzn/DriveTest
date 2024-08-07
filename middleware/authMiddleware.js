// middleware/authMiddleware.js
module.exports = (roles = []) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }

        if (roles.length > 0 && !roles.includes(req.session.user.userType)) {
            return res.redirect('/login');
        }

        next();
    };
};
