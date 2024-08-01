const User = require('../models/User');
const Appointment = require('../models/Appointment');

// RENDER EXAMINER PAGE
exports.examiner = async (req, res) => {
    try {
        // Get user details from database by matching id
        const user = await User.findById(req.session.user.userId);

        // Redirect to login if user doesn't exist
        if (!user) { return res.redirect('/login'); }

        // Default to 'G2' test booked drivers
        const testType = req.query.testType || 'G2';
        const drivers = await User.find({ testType }).populate('appointmentId');

        // Render examiner page with user data and test type
        res.render('examiner', { user, drivers, testType });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// UPDATE DRIVERS TEST RESULT WITH COMMENTS AND PASS/FAIL VALUE
exports.updateTestResult = async (req, res) => {
    try {
        const { userId, comment, passFail } = req.body;

        // Find the user by id and update their comment and pass/fail status
        await User.findByIdAndUpdate(userId, { comment, passFail }, { new: true });

        req.flash('success_msg', 'Test result updated successfully.');
        res.redirect('/examiner');
    } catch (error) {
        console.error('ERROR: ', error);
        req.flash('error_msg', 'Failed to update test result');
        res.redirect('/examiner');
    }
};