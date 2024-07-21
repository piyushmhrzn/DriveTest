const User = require('../models/User');
const Appointment = require('../models/Appointment');

// UPDATE USER DETAILS FROM G2 PAGE
exports.updateUserDetails = async (req, res) => {
    try {
        const { firstName, lastName, license, age, dob, carDetails } = req.body;
        const userId = req.session.user.userId;

        // Validate empty fields
        if (!firstName || !lastName || !age || !dob) {
            req.flash('error_msg', 'Error! Empty fields are required.');
            return res.redirect('/g2');
        }

        // Validate license number length
        if (typeof license !== 'undefined') {
            if (license.length < 6 || license.length > 10 || !license) {
                req.flash('error_msg', 'License number must be between 6 and 10 characters.');
                return res.redirect('/g2');
            }
        }

        // Prepare updated user data
        const updatedUserData = {
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

        // Update user data in the database
        await User.findByIdAndUpdate(userId, updatedUserData, { new: true });
        req.flash('success_msg', 'User details updated successfully.');
        res.redirect('/g2');
    } catch (error) {
        console.error('ERROR:', error);
        req.flash('error_msg', 'Failed to update user details. Please try again.');
        res.redirect('/g2');
    }
};

// UPDATE CAR DETAILS FROM G PAGE
exports.updateCarDetails = async (req, res) => {
    try {
        const userId = req.session.user.userId;

        // Prepare updated car details
        const updatedCarDetails = {
            'carDetails.company': req.body.company,
            'carDetails.model': req.body.model,
            'carDetails.year': req.body.year,
            'carDetails.plateNumber': req.body.plateNumber
        };

        // Update user's car details in the database
        await User.findByIdAndUpdate(userId, { $set: updatedCarDetails }, { new: true });
        req.flash('success_msg', 'Car details updated successfully.');
        res.redirect('/g');
    } catch (error) {
        console.error('ERROR:', error);
        req.flash('error_msg', 'Failed to update car details. Please try again.');
        res.redirect('/g');
    }
};

// BOOK APPOINTMENT SLOT
exports.bookAppointment = async (req, res) => {
    try {
        const { appointment, time } = req.body;

        // Find selected appointment slot by id
        const appointmentSlot = await Appointment.findById(time);

        if (!appointmentSlot || !appointmentSlot.isTimeSlotAvailable) {
            req.flash('error_msg', 'Time slot is no longer available.');
            return res.redirect(`/g2?date=${appointment}`);
        }

        // Update appointment slot by changing isTimeSlotAvailable flag to false
        appointmentSlot.isTimeSlotAvailable = false;
        await appointmentSlot.save();

        // Update user's appointment id
        const user = await User.findById(req.session.user.userId);
        user.appointmentId = appointmentSlot._id;
        await user.save();

        req.flash('success_msg', 'Appointment booked successfully.');
        res.redirect('/g2');
    } catch (error) {
        console.error('ERROR: ', error);
        req.flash('error_msg', 'Failed to book appointment');
        res.redirect('/g2');
    }
};

