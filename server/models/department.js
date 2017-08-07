const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const DateSchema  = new mongoose.Schema({
        starteddate: {type: Date},
        endeddate: {type: Date},
        isEnabled: {type: Boolean}
});

const DepartmentSchema = new Schema({
    name: { type: String, required: true },
    admin: Schema.Types.ObjectId,
    phone: {type: String, required: true},
    email: {type: String, required: true},
    date: [DateSchema]
});

module.exports = mongoose.model('departments', DepartmentSchema, 'departments');