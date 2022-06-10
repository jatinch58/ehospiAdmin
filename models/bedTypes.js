const { model, Schema } = require("mongoose");

const bedTypes = new Schema({
  hospitalCode: {
    type: String,
    required: true,
  },
  beds: [
    {
      bedName: {
        type: String,
        required: true,
      },
      facilities: {
        type: Array,
        required: true,
      },
      amenities: {
        type: Array,
        required: true,
      },
      charges: {
        facilitiesCharges: {
          type: Number,
          required: true,
        },
        amenitiesCharges: {
          type: Number,
          required: true,
        },
        bedCharges: {
          type: Number,
          required: true,
        },
        totalCharges: {
          type: Number,
          required: true,
        },
      },
    },
  ],
});

module.exports = model("mybedtypes", bedTypes);
