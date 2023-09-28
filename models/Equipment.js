const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema(
  {
    title: String,
    type: String,
    description: String,
    active: Boolean,
  },
  { timestamps: true }
);

module.exports = mongoose.model("Equipment", equipmentSchema);
