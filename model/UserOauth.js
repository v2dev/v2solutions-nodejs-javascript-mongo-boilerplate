const mongoose = require('mongoose');

const UserOauth = mongoose.Schema(
    {
        googleId: { type: String },
        name: { type: String },
        photo: { type: String },
    },
    { versionKey: false }
);

module.exports = mongoose.model('Useroauths', UserOauth);
