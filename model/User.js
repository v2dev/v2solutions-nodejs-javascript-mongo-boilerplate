const mongoose = require('mongoose');

const User = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    password: { type: String },
    country: { type: String },
    mfaSecret: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    token: {type: String}
});

module.exports = mongoose.model('users', User);
