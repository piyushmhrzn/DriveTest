const User = require('../models/User');

// Sign up User
exports.signUpUser = async (req, res) => {
    try {
        const { username, password, user_type } = req.body;

        const newUser = new User({
            username,
            password,
            userType: user_type
        });

        await newUser.save();
        res.redirect('/login?signup=success');
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login?signup=error');
    }
};

// Save user data from G2 page form
exports.saveUserData = async (req, res) => {
    try {
        const newUser = new User(req.body);
        await newUser.save();
        res.redirect('/');
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/error');
    }
};

// Find user using license number
exports.findUser = async (req, res) => {
    try {
        const license_number = req.query.license_number;
        const user = await User.findOne(
            { license: license_number }
        );

        if (!user) {
            return res.render('gTest', { user: null, isUser: true });
        }

        res.render('gTest', { user, isUser: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/error');
    }
};

// Update only the car details of the user in G page form
exports.updateCarDetails = async (req, res) => {
    try {
        const license_number = req.body.license_number;
        const updatedCarDetails = {
            'carDetails.company': req.body.company,
            'carDetails.model': req.body.model,
            'carDetails.year': req.body.year,
            'carDetails.plateNumber': req.body.plateNumber
        };

        const user = await User.findOneAndUpdate(
            { license: license_number },
            { $set: updatedCarDetails },
            { new: true }
        );

        if (!user) {
            return res.render('gTest', { user: null, isUser: true });
        }

        res.render('gTest', { user, isUser: false });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/error');
    }
};


