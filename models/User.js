const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    license: { type: String, required: true },
    age: { type: Number, min: 16, max: 65, required: true },
    dob: { type: Date, default: new Date(), required: true },
    carDetails: {
        company: String,
        model: String,
        year: Number,
        plateNumber: String
    }
});

const User = mongoose.model('User', userSchema);
module.exports = User;