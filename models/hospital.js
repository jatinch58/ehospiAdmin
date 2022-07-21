const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalSchema = new Schema({
  hospitalName: {
    type: String,
    required: true,
  },
  hospitalCode: {
    type: String,
    required: true,
  },
  hospitalType: {
    type: String,
    required: true,
  },
  hospitalAddress: {
    type: String,
    required: true,
  },
  city: {
    type: String,
    required: true,
  },
  state: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Hospital", hospitalSchema);
