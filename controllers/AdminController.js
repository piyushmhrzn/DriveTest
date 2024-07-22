const User = require('../models/User');
const Appointment = require('../models/Appointment');

// RENDER APPOINTMENT PAGE
exports.appointment = async (req, res) => {
    try {
        const user = await User.findById(req.session.user.userId);

        // Current date is the default if no date selected
        const selectedDate = req.query.date || new Date().toISOString().split('T')[0];    // Date in format: 'YYYY-MM-DD'

        // Appointment slot times
        const appointmentTimes = [
            '09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30',
            '01:00', '01:30', '02:00', '02:30', '03:00', '03:30', '04:00'
        ];

        // Get all existing appointments for the current date
        const existingAppointments = await Appointment.find({ date: selectedDate });

        // Creating a map of appointment times with their availability
        const appointmentsMap = appointmentTimes.map(time => {
            // Search existingAppointments array to check if there is an appointment already booked for that specified time
            const existingAppointment = existingAppointments.find(appointment => appointment.time === time);

            // Check if the slot is already booked by any driver
            const isBooked = existingAppointment && !existingAppointment.isTimeSlotAvailable ? true : false;

            return {
                time,
                isTimeSlotAvailable: existingAppointment ? existingAppointment.isTimeSlotAvailable : false,   // pass default false value if appointment doesnot exist
                isBooked: isBooked
            };
        });

        res.render('appointment', { user, appointmentDate: selectedDate, appointmentsMap });
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

        // Check if the appointment slot already booked by the user
        if (existingAppointment && !existingAppointment.isTimeSlotAvailable) {
            req.flash('error_msg', 'This appointment slot is already booked by a driver.');
            return res.redirect(`/appointment?date=${date}`);
        }

        // Check if the appointment slot already added for given date and time.
        if (existingAppointment) {
            req.flash('error_msg', 'This appointment slot has already been added.');
            return res.redirect(`/appointment?date=${date}`);
        }

        // Save only the new appointment slot to the database
        const newAppointment = new Appointment({ date, time, isTimeSlotAvailable: true });
        await newAppointment.save();
        req.flash('success_msg', 'Appointment slot added successfully.');
        res.redirect(`/appointment?date=${date}`);
    } catch (error) {
        console.error('Failed to add appointment slot:', error);
        req.flash('error_msg', 'Failed to add appointment slot.');
        res.redirect('/appointment');
    }
};
