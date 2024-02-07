const mongoose = require('mongoose');

const User = mongoose.Schema(
  {
    name: { type: String },
    email: { type: String },
    password: { type: String },
    country: { type: String },
    mfaSecret: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    token: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { versionKey: false },
);

module.exports = mongoose.model('users', User);
