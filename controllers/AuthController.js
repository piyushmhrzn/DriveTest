const User = require('../models/User');
const bcrypt = require('bcrypt');

// SIGN UP USER
exports.signUpUser = async (req, res) => {
    try {
        const { username, password, user_type } = req.body;

        // Check if the username already exists
        const existingUser = await User.findOne({ username });

        // If user exists, redirect back to login page with error message
        if (existingUser) {
            req.flash('error_msg', 'Username already exists.');
            return res.redirect('/login');
        }

        // Create a new user
        const newUser = new User({
            username,
            password,
            userType: user_type
        });

        // Save the new user to the database
        await newUser.save();
        req.flash('success_msg', 'Signup successful! Please login.');
        res.redirect('/login');
    } catch (error) {
        console.error('ERROR:', error);
        req.flash('error_msg', 'Signup failed. Please try again.');
        res.redirect('/login');
    }
};

// LOGIN USER
exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Find user by username
        const user = await User.findOne({ username });

        // If user is not found, redirect back to login page with error message
        if (!user) {
            req.flash('error_message', 'Sorry! User not found.');
            return res.redirect('/login');
        }

        // Compare entered password with hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        // If the password doesnot match, redirect back to login page with error message
        if (!passwordMatch) {
            req.flash('error_message', 'Incorrect password! Please try again');
            return res.redirect('/login');
        }

        // Set session user if login is successful
        req.session.user = {
            userId: user._id.toString(),
            userType: user.userType
        };

        // Redirect to dashboard when login is sucessful
        res.redirect('/');
    } catch (error) {
        console.error('ERROR:', error);
        req.flash('error_message', 'Login failed. Please try again.');
        res.redirect('/login');
    }
};