const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const hospitalAmenitiesSchema = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  details: [
    {
      amenities: {
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
module.exports = mongoose.model("hospitalAmenities", hospitalAmenitiesSchema);
