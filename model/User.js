const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    country: { type: String },
    mfaSecret: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
});

module.exports = mongoose.model('users', User);
