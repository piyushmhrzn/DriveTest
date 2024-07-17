const User = require('../models/User');
const Appointment = require('../models/Appointment');

// RENDER APPOINTMENT PAGE
exports.appointment = async (req, res) => {
    try {
        const currentDate = new Date();

        // Date in format: 'YYYY-MM-DD'
        const appointmentDate = currentDate.toISOString().split('T')[0];

        // Available times
        const availableTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00'];

        const user = await User.findById(req.session.user.userId);

        res.render('appointment', { appointmentDate, availableTimes, user });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// ADD APPOINTMENT
exports.addAppointment = async (req, res) => {
    const { date, time } = req.body;

    try {
        // Save the appointment slot to the database
        await Appointment.create({ date, time });

        req.flash('success_msg', 'Appointment slot added successfully.');
        res.redirect('/appointment');
    } catch (error) {
        console.error('Failed to add appointment slot:', error);
        req.flash('error_msg', 'Failed to add appointment slot.');
        res.redirect('/appointment');
    }
};
