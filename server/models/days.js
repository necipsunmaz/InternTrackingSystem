const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DaysSchema = new Schema({
  intern_id: String,
  date: Date,
  am: Boolean,
  pm: Boolean
});

module.exports = mongoose.model('days', DaysSchema, 'days');
