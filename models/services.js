const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const servicesSchema = new Schema({
  services: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("adminServices", servicesSchema);
