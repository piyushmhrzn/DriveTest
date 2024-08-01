const User = require('../models/User');
const Appointment = require('../models/Appointment');
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
        // Get user details from database by using session id and populate appointmentId with its Appointment object
        const user = await User.findById(req.session.user.userId).populate('appointmentId');

        // Redirect to login if user doesn't exist
        if (!user) { return res.redirect('/login'); }

        // Compare user's license with default license string 'LICENSE123'
        const licenseMatch = await bcrypt.compare('LICENSE123', user.license);

        // Get the selected date from query or use current date
        const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

        // Get existing appointments for the selected date
        const existingAppointments = await Appointment.find({ date: selectedDate, isTimeSlotAvailable: true });

        // Render g page with user data, licenseMatch boolean value, selected date, 
        // all appointments available for that selected date and test type
        res.render('gTest', {
            user,
            selectedDate,
            existingAppointments,
            isDefaultLicense: licenseMatch,
            bookedAppointment: user.appointmentId,
            test: 'G'
        });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// RENDER G2 PAGE
exports.g2Page = async (req, res) => {
    try {
        // Get user details from database by using session id and populate appointmentId with its Appointment object
        const user = await User.findById(req.session.user.userId).populate('appointmentId');

        // Redirect to login if user doesn't exist
        if (!user) { return res.redirect('/login'); }

        // Compare user's license with default license string 'LICENSE123'
        const licenseMatch = await bcrypt.compare('LICENSE123', user.license);

        // Get the selected date from query or use current date
        const selectedDate = req.query.date || new Date().toISOString().split('T')[0];

        // Get existing appointments for the selected date
        const existingAppointments = await Appointment.find({ date: selectedDate, isTimeSlotAvailable: true });

        // Render g2 page with user data, licenseMatch boolean value, selected date, 
        // all appointments available for that selected date and test type
        res.render('g2Test', {
            user,
            selectedDate,
            existingAppointments,
            isDefaultLicense: licenseMatch,
            bookedAppointment: user.appointmentId,
            test: 'G2'
        });
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