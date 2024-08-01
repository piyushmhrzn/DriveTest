const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true, default: 'Jon' },
    lastName: { type: String, required: true, default: 'Jones' },
    license: { type: String, required: true, default: 'LICENSE123' },
    age: { type: Number, min: 16, max: 65, required: true, default: 30 },
    dob: { type: Date, required: true, default: new Date() },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, required: true },
    carDetails: {
        company: { type: String, default: 'Honda' },
        model: { type: String, default: 'Civic' },
        year: { type: Number, default: 2022 },
        plateNumber: { type: String, default: 'HCB22G' }
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    },
    testType: {
        type: String,
        enum: ['G', 'G2'],
        default: null
    },
    comment: { type: String, default: '' },
    passFail: { type: Boolean, default: null }
});

// Encrypting license number before saving to database
userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('license')) return next();

    bcrypt.hash(user.license, 10, (error, hash) => {
        if (error) { return next(error); }
        user.license = hash;
        next();
    });
});

// Encrypting password before saving to database
userSchema.pre('save', function (next) {
    const user = this;

    if (!user.isModified('password')) return next();

    bcrypt.hash(user.password, 10, (error, hash) => {
        if (error) { return next(error); }
        user.password = hash;
        next();
    });
});

const User = mongoose.model('User', userSchema);
module.exports = User;