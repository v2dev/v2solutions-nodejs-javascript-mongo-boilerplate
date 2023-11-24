const mongoose = require('mongoose');

const Employee = mongoose.Schema({
    name: { type: String },
    email: { type: String },
    dob: { type: String },
    designation: { type: String },
    education: { type: String },
});

module.exports = mongoose.model('employees', Employee);
