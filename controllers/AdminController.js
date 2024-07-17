const User = require('../models/User');
const Appointment = require('../models/Appointment');

// RENDER APPOINTMENT PAGE
exports.appointment = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.userId);

        // Get Current Date
        const currentDate = new Date();

        //Format Date
        const format = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const formattedDate = new Intl.DateTimeFormat('en-US', format).format(currentDate);     // Formatted date
        const appointmentDate = currentDate.toISOString().split('T')[0];    // Date in format: 'YYYY-MM-DD'

        // Appointment slot times
        const appointmentTimes = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00'];

        // Get all existing appointments for the current date
        const existingAppointments = await Appointment.find({ date: appointmentDate });

        // Creating a map of appointment times with their availability
        const appointmentsMap = appointmentTimes.map(time => {
            // Search existingAppointments array to check if there is an appointment already booked for that specified time
            const existingAppointment = existingAppointments.find(appointment => appointment.time === time);
            return {
                time,
                isTimeSlotAvailable: !existingAppointment || existingAppointment.isTimeSlotAvailable    // pass true value if appointment doesnot exist or the stored boolean value for that time slot
            };
        });

        res.render('appointment', { user, formattedDate, appointmentDate, appointmentsMap });
    } catch (error) {
        console.error('ERROR:', error);
        res.redirect('/login');
    }
};

// ADD APPOINTMENT
exports.addAppointment = async (req, res) => {
    try {
        const { date, time } = req.body;

        // Get existing appointments from database
        const existingAppointment = await Appointment.findOne({ date, time });

        // Validation to check if the appointment is already done for given date and time.
        if (existingAppointment) {
            req.flash('error_msg', 'This time slot is already taken.');
            return res.redirect('/appointment');
        }

        // Save only the new appointment slot to the database
        const newAppointment = new Appointment({ date, time, isTimeSlotAvailable: false });
        await newAppointment.save();
        req.flash('success_msg', 'Appointment slot added successfully.');
        res.redirect('/appointment');
    } catch (error) {
        console.error('Failed to add appointment slot:', error);
        req.flash('error_msg', 'Failed to add appointment slot.');
        res.redirect('/appointment');
    }
};
