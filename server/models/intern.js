const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const InternSchema = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    gender: { type: Boolean },
    email: { type: String },
    department: Schema.Types.ObjectId,
    photo: { type: String },
    tc: { type: String },
    dob: { type: Date },
    starteddate: { type: Date },
    endeddate: { type: Date },
    phone: { type: String },
    address: { type: String },
    academician: Schema.Types.ObjectId,
    teacher: {type: String},
    isComplete:{type: Boolean, default: null},
    verified: { type: Boolean, default: false }
});

module.exports = mongoose.model('interns', InternSchema, 'interns');