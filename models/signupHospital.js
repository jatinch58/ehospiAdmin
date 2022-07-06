const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const signupHospitalSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  hospitalName: {
    type: String,
    required: true,
  },
  status: {
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
module.exports = mongoose.model("signupHospital", signupHospitalSchema);
