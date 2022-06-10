const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const facilitiesSchema = new Schema({
  facilities: {
    type: String,
    required: true,
  },
});
module.exports = mongoose.model("Facilities", facilitiesSchema);
