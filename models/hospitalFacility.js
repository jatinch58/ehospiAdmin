const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalFacilitiesSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  details: [
    {
      facilities: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        default: 0,
      },
    },
  ],
});
module.exports = mongoose.model("hospitalFacilities", hospitalFacilitiesSchema);
