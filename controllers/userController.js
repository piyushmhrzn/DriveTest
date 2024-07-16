const User = require('../models/User');
const bcrypt = require('bcrypt');

// Sign up User
exports.signUpUser = async (req, res) => {
    try {
        const { username, password, user_type } = req.body;

        const existingUser = await User.findOne({ username });

        if (existingUser) {
            req.session.error_msg = 'Username already exists.';
            return res.redirect('/login?signup=error_username');
        }

        const newUser = new User({
            username,
            password,
            userType: user_type
        });

        await newUser.save();
        req.session.success_msg = 'Signup successful! Please login.';
        res.redirect('/login?signup=success_signup');
    } catch (error) {
        console.error('ERROR:', error);
        req.session.error_msg = 'Signup failed. Please try again.';
        res.redirect('/login?signup=error_signup');
    }
};

// Login User
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            req.session.error_msg = 'Error! User not found.';
            return res.redirect('/login?login=error_username');
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            req.session.error_msg = 'Incorrect password! Please try again.';
            return res.redirect('/login?login=error_password');
        }

        req.session.user = {
            userId: user._id.toString(),
            userType: user.userType
        };

        res.redirect('/g2');
    } catch (error) {
        console.error('ERROR:', error);
        req.session.error_msg = 'Login failed. Please try again.';
        res.redirect('/login?login=error');
    }
};

// Update user data from G2 page
exports.saveUserData = async (req, res) => {
    try {
        const { firstName, lastName, license, age, dob, carDetails } = req.body;
        const userId = req.session.user.userId;

        const updatedData = {
            firstName,
            lastName,
            license,
            age,
            dob,
            carDetails: {
                company: carDetails.company,
                model: carDetails.model,
                year: carDetails.year,
                plateNumber: carDetails.plateNumber
            }
        };

        await User.findByIdAndUpdate(userId, updatedData, { new: true });
        req.session.success_msg = 'User details updated successfully.';
        res.redirect('/g2?success=success_form');
    } catch (error) {
        console.error('ERROR:', error);
        req.session.error_msg = 'Failed to update user info. Please try again.';
        res.redirect('/g2?error=error_update');
    }
};

// Update only the car details of the user in G page form
exports.updateCarDetails = async (req, res) => {
    try {
        const userId = req.session.user.userId;

        const updatedCarDetails = {
            'carDetails.company': req.body.company,
            'carDetails.model': req.body.model,
            'carDetails.year': req.body.year,
            'carDetails.plateNumber': req.body.plateNumber
        };

        const user = await User.findByIdAndUpdate(userId, { $set: updatedCarDetails }, { new: true });

        if (!user) {
            return res.render('gTest');
        }

        req.session.success_msg = 'Car Details updated successfully.';
        res.redirect('/g?success=success_form');
    } catch (error) {
        console.error('ERROR:', error);
        req.session.error_msg = 'Failed to update car details. Please try again.';
        res.redirect('/g?error=error_update');
    }
};


