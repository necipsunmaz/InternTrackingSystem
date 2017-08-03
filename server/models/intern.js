const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const InternSchema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: Boolean },
    email: { type: String },
    photo: { type: String },
    tc: { type: String },
    dob: { type: Date },
    starteddate: { type: Date },
    endeddate: { type: Date },
    phone: { type: String },
    address: { type: String },
    verified: { type: Boolean, default: false },
    days: [{
        date: Date,
        am: Boolean,
        pm: Boolean
    }]
});

module.exports = mongoose.model('interns', InternSchema, 'interns');