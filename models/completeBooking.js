const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const completeSchema = new Schema({
  bookingId: {
    type: String,
    required: true,
  },
  patientName: {
    type: String,
    required: true,
  },
  hospitalCode: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("completedBooking", completeSchema);
