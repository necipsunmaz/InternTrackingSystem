const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const DepartmentSchema = new Schema({
    name: { type: String, required: true }
});

module.exports = mongoose.model('interns', InternSchema, 'interns');